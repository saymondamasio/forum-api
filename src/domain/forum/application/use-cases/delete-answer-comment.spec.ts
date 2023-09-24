import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import InMemoryAnswerCommentsRepository from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let deleteAnswerComment: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    deleteAnswerComment = new DeleteAnswerCommentUseCase(
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to delete answer', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author'),
    })

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await deleteAnswerComment.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author',
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete answer comment from another user', async () => {
    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('test-answer-comment'),
    )

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await expect(
      deleteAnswerComment.execute({
        answerCommentId: 'test-answer',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
