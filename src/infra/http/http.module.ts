import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

import { CreateAccountController } from './controllers/create-account.controller'
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  controllers: [
    CreateAccountController,
    ListRecentQuestionsController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
