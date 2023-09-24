import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import InMemoryAnswerCommentsRepository from 'test/repositories/in-memory-answer-comments-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let commentOnAnswer: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()

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
