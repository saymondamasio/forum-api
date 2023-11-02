import { ListAnswersUseCase } from './list-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import InMemoryAnswerAttachmentsRepository from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let listAnswersUseCase: ListAnswersUseCase

describe('List Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    listAnswersUseCase = new ListAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to list recent questions', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const { isRight, value } = await listAnswersUseCase.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(isRight()).toBe(true)
    expect(value?.answers).toHaveLength(3)
  })

  it('should be able to list paginated recent questions', async () => {
    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    })

    const { isRight, value } = await listAnswersUseCase.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(isRight()).toBe(true)
    expect(value?.answers).toHaveLength(10)
  })
})
