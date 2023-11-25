import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export default class InMemoryAttachmentsRepository
  implements AttachmentsRepository
{
  public items: Attachment[] = []
  A
  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
