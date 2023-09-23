import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerUseCaseRequest {
  id: string
  authorId: string
}

// interface DeleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ id, authorId }: DeleteAnswerUseCaseRequest): Promise<void> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('You are not authorized to delete this answer')
    }

    await this.answersRepository.delete(answer)
  }
}
