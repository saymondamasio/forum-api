import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'

import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const validationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(validationPipe)
    body: CreateQuestionBodySchema,
  ) {
    const { content, title } = body

    const userId = user.sub

    const slug = this.slugify(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private slugify(str: string) {
    return (
      str
        // Normaliza a string para remover os acentos e outros caracteres especiais
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

        .toLowerCase()
        // Substitui os espaços por hífens
        .replace(/\s+/g, '-')
        // Remove os caracteres que não são letras, números ou hífens
        .replace(/[^a-z0-9-]/g, '')
    )
  }
}
