import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import InMemoryStudentsRepository from './in-memory-students-repository'
import InMemoryQuestionAttachmentRepository from './in-memory-question-attachments-repository'
import InMemoryAttachmentsRepository from './in-memory-attachments-repository'

const PAGE_SIZE = 20

export default class InMemoryQuestionsRepository
  implements QuestionsRepository
{
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) return null

    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    )

    if (!author)
      throw new Error(
        `Author with ID ${question.authorId.toString()} not exists`,
      )

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id),
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentRepository.items.find((attachment) =>
        attachment.id.equals(questionAttachment.attachmentId),
      )

      if (!attachment)
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} not exists`,
        )

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: author.id,
      author: author.name,
      content: question.content,
      slug: question.slug,
      title: question.title,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async save(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items[questionIndex] = question

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    return question ?? null
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)

    await this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )

    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getItems(),
    )
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    return question ?? null
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
