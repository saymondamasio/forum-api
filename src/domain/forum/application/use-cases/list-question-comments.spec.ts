import InMemoryQuestionCommentsRepository from 'test/repositories/in-memory-question-comments-repository'
import { ListQuestionCommentsUseCase } from './list-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let listQuestionComments: ListQuestionCommentsUseCase

describe('List Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    listQuestionComments = new ListQuestionCommentsUseCase(
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to list question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const { questionComments } = await listQuestionComments.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(questionComments).toHaveLength(3)
  })

  it('should be able to list paginated question comments', async () => {
    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    })

    const { questionComments } = await listQuestionComments.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(questionComments).toHaveLength(10)
  })
})
