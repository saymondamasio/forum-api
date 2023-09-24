import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './erros/not-allowed-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let editQuestion: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    editQuestion = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to edit question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('test-question'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await editQuestion.execute({
      authorId: 'author',
      questionId: newQuestion.id.toString(),
      content: 'Test content',
      title: 'Test title',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'Test content',
      title: 'Test title',
    })
  })

  it('should not be able to edit question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('test-question'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await editQuestion.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      content: 'Test content',
      title: 'Test title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
