import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from './delete-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let deleteAnswer: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    deleteAnswer = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('test-answer'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await deleteAnswer.execute({
      id: 'test-answer',
      authorId: 'author',
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('test-answer'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await expect(
      deleteAnswer.execute({
        id: 'test-answer',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
