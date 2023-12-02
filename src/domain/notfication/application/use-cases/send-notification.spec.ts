import { SendNotificationUseCase } from './send-notification'

import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

describe('Create Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )
  })

  it('should be able send notification', async () => {
    const result = await sendNotification.execute({
      recipientId: 'recipient-id',
      title: 'New Notification',
      content: 'Content',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.notification.id).toBeTruthy()
      expect(result.value.notification.title).toEqual('New Notification')
    }
  })
})
