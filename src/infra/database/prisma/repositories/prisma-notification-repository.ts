import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/Notification'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}
  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })
  }
}
