import { ListAnswerCommentsUseCase } from './list-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import InMemoryAnswerCommentsRepository from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let listAnswerComments: ListAnswerCommentsUseCase

describe('List Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    listAnswerComments = new ListAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to list answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await listAnswerComments.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(3)
    }
  })

  it('should be able to list paginated answer comments', async () => {
    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    })

    const result = await listAnswerComments.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(10)
    }
  })
})
