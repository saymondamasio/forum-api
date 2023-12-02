import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/erros/not-allowed-error'

import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

import InMemoryAnswerCommentsRepository from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import InMemoryStudentsRepository from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let deleteAnswerComment: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
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

    const result = await deleteAnswerComment.execute({
      answerCommentId: 'test-answer-comment',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
