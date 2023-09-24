import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let getQuestionBySlug: GetQuestionBySlugUseCase

describe('Get Question by Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    getQuestionBySlug = new GetQuestionBySlugUseCase(
      inMemoryQuestionsRepository,
    )
  })

  it('should be able to get question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('test-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const { isRight, value } = await getQuestionBySlug.execute({
      slug: 'test-question',
    })

    expect(isRight()).toBe(true)

    if (isRight()) {
      expect(value.question.id).toBeTruthy()
      expect(value.question.title).toEqual(newQuestion.title)
    }
  })
})
