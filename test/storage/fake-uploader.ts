import { randomUUID } from 'crypto'

import { UploadParams, Uploader } from '@/infra/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      url,
      fileName,
    })

    return {
      url,
    }
  }
}
