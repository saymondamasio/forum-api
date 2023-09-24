import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import InMemoryQuestionCommentsRepository from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let deleteQuestionComment: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    deleteQuestionComment = new DeleteQuestionCommentUseCase(
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to delete question', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await deleteQuestionComment.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author',
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question comment from another user', async () => {
    const questionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('test-question-comment'),
    )

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await expect(
      deleteQuestionComment.execute({
        questionCommentId: 'test-question',
        authorId: 'author-2',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
