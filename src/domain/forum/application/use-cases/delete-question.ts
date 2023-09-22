import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseRequest {
  id: string
  authorId: string
}

// interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ id, authorId }: DeleteQuestionUseCaseRequest): Promise<void> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not authorized to delete this question')
    }

    await this.questionsRepository.delete(question)
  }
}
