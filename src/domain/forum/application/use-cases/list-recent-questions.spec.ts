import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let listRecentQuestions: ListRecentQuestionsUseCase

describe('List Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    listRecentQuestions = new ListRecentQuestionsUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to list recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 10),
      }),
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 1),
      }),
    )

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 5),
      }),
    )

    const { questions } = await listRecentQuestions.execute({ page: 1 })

    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 10),
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 5),
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 1),
      }),
    ])
  })

  it('should be able to list paginated recent questions', async () => {
    Array.from({ length: 40 }).forEach(async () => {
      await inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: new Date(2023, 0, 10),
        }),
      )
    })

    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 5),
      }),
    )

    const { questions } = await listRecentQuestions.execute({ page: 2 })

    expect(questions).toHaveLength(20)
  })
})
