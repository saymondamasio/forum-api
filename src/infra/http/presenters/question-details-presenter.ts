import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHttp(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      content: questionDetails.content,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHttp),
      author: questionDetails.author,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      createAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
