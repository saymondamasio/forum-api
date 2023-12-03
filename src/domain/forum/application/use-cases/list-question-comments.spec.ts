import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ListQuestionCommentsUseCase } from './list-question-comments'

import InMemoryQuestionCommentsRepository from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import InMemoryStudentsRepository from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let listQuestionComments: ListQuestionCommentsUseCase
let inMemoryStudentRepository: InMemoryStudentsRepository

describe('List Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    )
    listQuestionComments = new ListQuestionCommentsUseCase(
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to list question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentsRepository.create(comment1)

    await inMemoryQuestionCommentsRepository.create(comment2)

    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await listQuestionComments.execute({
      page: 1,
      questionId: 'question-1',
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
            commentId: comment2.id,
            author: 'John Doe',
          }),
          expect.objectContaining({
            commentId: comment3.id,
            author: 'John Doe',
          }),
        ]),
      )
    }
  })

  it('should be able to list paginated question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })

    inMemoryStudentRepository.items.push(student)
    Array.from({ length: 30 }).forEach(async () => {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    })

    const result = await listQuestionComments.execute({
      page: 2,
      questionId: 'question-1',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(10)
    }
  })
})
