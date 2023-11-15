import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'

import { CreateAccountController } from './controllers/create-account.controller'
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    ListRecentQuestionsController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [CreateQuestionUseCase, ListRecentQuestionsUseCase],
})
export class HttpModule {}
