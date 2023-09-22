import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let deleteQuestion: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    deleteQuestion = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to delete question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('test-question'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await deleteQuestion.execute({
      id: 'test-question',
      authorId: 'author',
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('test-question'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await expect(
      deleteQuestion.execute({
        id: 'test-question',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
