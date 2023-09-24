import { CreateQuestionUseCase } from './create-question'
import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let createQuestion: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    createQuestion = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  test('create an question', async () => {
    const result = await createQuestion.execute({
      authorId: 'instructorId',
      title: 'New Answer',
      content: 'Content',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question.id).toBeTruthy()
      expect(result.value.question.title).toEqual('New Answer')
      expect(inMemoryQuestionsRepository.items[0].id).toEqual(
        result.value.question.id,
      )
    }
  })
})
