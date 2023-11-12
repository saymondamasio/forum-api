import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface ListAnswersUseCaseRequest {
  page: number
  questionId: string
}

type ListAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
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

    return right({ answers })
  }
}
