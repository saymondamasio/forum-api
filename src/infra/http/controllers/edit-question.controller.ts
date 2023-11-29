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
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const validationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(validationPipe)
    body: EditQuestionBodySchema,
    @Param('id') questionId: string,
  ) {
    const { content, title, attachments } = body
    const userId = user.sub

    const result = await this.editQuestion.execute({
      authorId: userId,
      title,
      attachmentIds: attachments,
      content,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
