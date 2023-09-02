import { expect, test } from 'vitest'

import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/Answers-repository'

const fakeAnswersRepository: AnswersRepository = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  create: async (answer) => {},
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestion.execute({
    instructorId: 'instructorId',
    questionId: 'questionId',
    content: 'New Answer',
  })

  expect(answer.content).toEqual('New Answer')
})
