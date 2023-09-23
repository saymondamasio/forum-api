import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { ListRecentQuestionsUseCase } from './list-recent-questions'
import { ListAnswersUseCase } from './list-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let listAnswersUseCase: ListAnswersUseCase

describe('List Answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
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

    const { answers } = await listAnswersUseCase.execute({
      page: 1,
      questionId: 'question-1',
    })

    expect(answers).toHaveLength(3)
  })

  it('should be able to list paginated recent questions', async () => {
    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    })

    const { answers } = await listAnswersUseCase.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(answers).toHaveLength(10)
  })
})
