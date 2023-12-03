import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'
import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let questionFactory: QuestionFactory
  let cacheRepository: CacheRepository
  let questionsRepository: QuestionsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    questionsRepository = moduleRef.get(QuestionsRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toEqual(JSON.stringify(questionDetails))
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    expect(questionDetails).toEqual({ empty: true })
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent()

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionsRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
