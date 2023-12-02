import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ListAnswerCommentsUseCase } from './list-answer-comments'

import { makeAnswerComment } from 'test/factories/make-answer-comment'
import InMemoryAnswerCommentsRepository from 'test/repositories/in-memory-answer-comments-repository'
import InMemoryStudentsRepository from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let listAnswerComments: ListAnswerCommentsUseCase

describe('List Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    listAnswerComments = new ListAnswerCommentsUseCase(
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to list answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentsRepository.create(comment1)

    await inMemoryAnswerCommentsRepository.create(comment2)

    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await listAnswerComments.execute({
      page: 1,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3)
      expect(result.value.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: 'John Doe',
            commentId: comment1.id,
          }),
          expect.objectContaining({
            author: 'John Doe',
            commentId: comment2.id,
          }),
          expect.objectContaining({
            author: 'John Doe',
            commentId: comment3.id,
          }),
        ]),
      )
    }
  })

  it('should be able to list paginated answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentsRepository.items.push(student)

    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    })

    const result = await listAnswerComments.execute({
      page: 2,
      answerId: 'answer-1',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(10)
    }
  })
})
