import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editAnswerBodySchema = z.object({
  content: z.string(),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const validationPipe = new ZodValidationPipe(editAnswerBodySchema)

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(validationPipe)
    body: EditAnswerBodySchema,
    @Param('id') answerId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      authorId: userId,
      attachmentIds: [],
      content,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
