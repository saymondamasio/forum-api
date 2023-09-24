import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { NotAllowedError } from './erros/not-allowed-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let editAnswer: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    editAnswer = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to edit answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('test-answer'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await editAnswer.execute({
      authorId: 'author',
      answerId: newAnswer.id.toString(),
      content: 'Test content',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'Test content',
    })
  })

  it('should not be able to edit answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('test-answer'),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await editAnswer.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toString(),
      content: 'Test content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
