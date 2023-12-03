import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students-repository'
import { HashGenerator } from '../cryptography/hash-generator'

import { StudentsAlreadyExistsError } from './erros/students-already-exits-error'

interface RegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentsAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(
      email,
    )

    if (studentWithSameEmail) {
      return left(new StudentsAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
