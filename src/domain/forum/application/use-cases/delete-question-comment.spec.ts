import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/erros/not-allowed-error'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

import InMemoryQuestionCommentsRepository from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import InMemoryStudentsRepository from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let deleteQuestionComment: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
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

    const result = await deleteQuestionComment.execute({
      questionCommentId: 'test-question-comment',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
