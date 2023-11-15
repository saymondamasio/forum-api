import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentsAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student "${identifier}" with same email address already exists.`)
  }
}
