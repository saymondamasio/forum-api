import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import InMemoryStudentsRepository from './in-memory-students-repository'

const PAGE_SIZE = 10

export default class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: QuestionComment[] = []

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return questionComments.map((questionComments) => {
      const author = this.studentsRepository.items.find((student) =>
        student.id.equals(questionComments.authorId),
      )

      if (!author)
        throw new Error(
          `Author with ID ${questionComments.authorId.toString()} not found`,
        )

      return CommentWithAuthor.create({
        commentId: questionComments.id,
        content: questionComments.content,
        authorId: questionComments.authorId,
        author: author.name,
        createdAt: questionComments.createdAt,
        updatedAt: questionComments.updatedAt,
      })
    })
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(questionCommentIndex, 1)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    return questionComment ?? null
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }
}
