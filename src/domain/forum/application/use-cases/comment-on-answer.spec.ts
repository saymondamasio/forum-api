import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CommentOnAnswerUseCase } from './comment-on-answer'

import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import InMemoryAnswerCommentsRepository from 'test/repositories/in-memory-answer-comments-repository'
import InMemoryAnswerAttachmentsRepository from 'test/repositories/in-memory-answer-attachments-repository'
import InMemoryStudentsRepository from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let commentOnAnswer: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    commentOnAnswer = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID('author'),
    })

    await inMemoryAnswersRepository.create(answer)

    await commentOnAnswer.execute({
      answerId: answer.id.toString(),
      authorId: 'author',
      content: 'Comment',
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Comment')
  })
})
