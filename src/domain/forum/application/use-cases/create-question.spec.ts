import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { CreateQuestionUseCase } from './create-question'

import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import InMemoryQuestionAttachmentRepository from 'test/repositories/in-memory-question-attachments-repository'
import InMemoryStudentsRepository from 'test/repositories/in-memory-students-repository'
import InMemoryAttachmentsRepository from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let createQuestion: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    createQuestion = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to create an question', async () => {
    const result = await createQuestion.execute({
      authorId: 'instructorId',
      title: 'New Answer',
      content: 'Content',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.question.id).toBeTruthy()
      expect(result.value.question.title).toEqual('New Answer')
      expect(inMemoryQuestionsRepository.items[0].id).toEqual(
        result.value.question.id,
      )
      expect(inMemoryQuestionsRepository.items[0]).toEqual(
        result.value.question,
      )

      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems,
      ).toHaveLength(2)
      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems,
      ).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ])
    }
  })

  it('should persist attachments when creating a question', async () => {
    const result = await createQuestion.execute({
      authorId: 'instructorId',
      title: 'New Answer',
      content: 'Content',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2)
      expect(inMemoryQuestionAttachmentRepository.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            attachmentId: new UniqueEntityID('1'),
          }),
          expect.objectContaining({
            attachmentId: new UniqueEntityID('2'),
          }),
        ]),
      )
    }
  })
})
