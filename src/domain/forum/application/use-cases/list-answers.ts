import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface ListAnswersUseCaseRequest {
  page: number
  questionId: string
}

interface ListAnswersUseCaseResponse {
  answers: Answer[]
}

export class ListAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: ListAnswersUseCaseRequest): Promise<ListAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return { answers }
  }
}
