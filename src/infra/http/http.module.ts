import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'

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
})
export class HttpModule {}
