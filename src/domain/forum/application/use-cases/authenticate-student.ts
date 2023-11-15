import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'

import { StudentsAlreadyExistsError } from './erros/students-already-exits-error'
import { WrongCredentialsError } from './erros/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
