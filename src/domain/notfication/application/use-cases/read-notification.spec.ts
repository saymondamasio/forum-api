import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notificaiton'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/erros/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let readNotification: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    readNotification = new ReadNotificationUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should be able send notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await readNotification.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    console.log(result.value)
    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
        expect.any(Date),
      )
    }
  })

  it('should not be able to read notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await inMemoryNotificationsRepository.create(notification)

    const result = await readNotification.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
