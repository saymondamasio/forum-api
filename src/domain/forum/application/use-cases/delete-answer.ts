import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteAnswerUseCaseRequest {
  id: string
  authorId: string
}

// interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ id, authorId }: DeleteAnswerUseCaseRequest): Promise<void> {
    const question = await this.answersRepository.findById(id)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not authorized to delete this question')
    }

    await this.answersRepository.delete(question)
  }
}
