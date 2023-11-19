import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { ListQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/list-question-answers'
import { AnswerPresenter } from '../presenters/anwer-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions/:questionId/answers')
export class ListQuestionAnswersController {
  constructor(private listQuestionAnswers: ListQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.listQuestionAnswers.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHttp) }
  }
}
