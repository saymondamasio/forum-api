import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Attachment } from '../../enterprise/entities/attachment'
import { Uploader } from '@/domain/forum/application/storage/uploader'

import { InvalidAttachmentTypeError } from './erros/invalid-attachment-type-error'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const validadeTypeRegex = /^(image\/jpeg|image\/png|application\/pdf)$/

    if (!validadeTypeRegex.test(fileType))
      return left(new InvalidAttachmentTypeError(fileType))

    const { url } = await this.uploader.upload({
      body,
      fileName,
      fileType,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
