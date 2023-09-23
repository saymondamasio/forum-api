import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

const PAGE_SIZE = 20

export default class InMemoryQuestionsRepository
  implements QuestionsRepository
{
  public items: Question[] = []

  async save(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items[questionIndex] = question
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    return question ?? null
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    return question ?? null
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)
  }
}
