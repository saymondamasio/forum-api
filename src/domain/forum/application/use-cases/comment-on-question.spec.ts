import InMemoryQuestionCommentsRepository from 'test/repositories/in-memory-question-comments-repository'
import { CreateQuestionUseCase } from './create-question'
import InMemoryQuestionsRepository from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let commentOnQuestion: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()

    commentOnQuestion = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author'),
    })

    await inMemoryQuestionsRepository.create(question)

    await commentOnQuestion.execute({
      questionId: question.id.toString(),
      authorId: 'author',
      content: 'Comment',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comment',
    )
  })
})
