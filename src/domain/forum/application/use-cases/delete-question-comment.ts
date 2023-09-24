import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
}

// interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(
    private questionsCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionCommentId,
    authorId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<void> {
    const questionComment = await this.questionsCommentsRepository.findById(
      questionCommentId,
    )

    if (!questionComment) {
      throw new Error('Comment question not found')
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error('You are not authorized to delete this comment question')
    }

    await this.questionsCommentsRepository.delete(questionComment)
  }
}
