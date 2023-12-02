import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import InMemoryStudentsRepository from './in-memory-students-repository'

const PAGE_SIZE = 20

export default class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return answerComments.map((answerComments) => {
      const author = this.studentsRepository.items.find((student) =>
        student.id.equals(answerComments.authorId),
      )

      if (!author)
        throw new Error(
          `Author with ID ${answerComments.authorId.toString()} not found`,
        )

      return CommentWithAuthor.create({
        commentId: answerComments.id,
        content: answerComments.content,
        authorId: answerComments.authorId,
        author: author.name,
        createdAt: answerComments.createdAt,
        updatedAt: answerComments.updatedAt,
      })
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(answerCommentIndex, 1)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    return answerComment ?? null
  }

  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }
}
