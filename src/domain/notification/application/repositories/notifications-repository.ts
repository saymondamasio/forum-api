import { Notification } from '../../enterprise/entities/Notification'

export abstract class NotificationsRepository {
  abstract findById(id: string): Promise<Notification | null>
  abstract save(notification: Notification): Promise<void>
  abstract create(notification: Notification): Promise<void>
}
