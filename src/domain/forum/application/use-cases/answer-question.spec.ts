import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let answerQuestion: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    answerQuestion = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able create an answer', async () => {
    const { answer } = await answerQuestion.execute({
      instructorId: 'instructorId',
      questionId: 'questionId',
      content: 'New Answer',
    })

    expect(answer.content).toEqual('New Answer')
    expect(inMemoryAnswersRepository.items[0].id).toEqual(answer.id)
  })
})
