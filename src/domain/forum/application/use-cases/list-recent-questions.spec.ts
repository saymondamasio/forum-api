import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ListRecentQuestionsUseCase } from './list-recent-questions'
import InMemoryQuestionAttachmentRepository from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let listRecentQuestions: ListRecentQuestionsUseCase

describe('List Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )
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

    const result = await listRecentQuestions.execute({ page: 1 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questions).toEqual([
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
    }
  })

  it('should be able to list paginated recent questions', async () => {
    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryQuestionsRepository.create(
        makeQuestion({
          createdAt: new Date(2023, 0, 10),
        }),
      )
    })

    const result = await listRecentQuestions.execute({ page: 2 })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.questions).toHaveLength(10)
    }
  })
})
