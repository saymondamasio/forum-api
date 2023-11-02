import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import InMemoryAnswerAttachmentsRepository from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let answerQuestion: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    answerQuestion = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('should be able create an answer', async () => {
    const { isRight, value } = await answerQuestion.execute({
      instructorId: 'instructorId',
      questionId: 'questionId',
      content: 'New Answer',
      attachmentIds: ['1', '2'],
    })

    expect(isRight()).toBe(true)
    expect(value?.answer.content).toEqual('New Answer')
    expect(inMemoryAnswersRepository.items[0].id).toEqual(value?.answer.id)

    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ],
    )
  })
})
