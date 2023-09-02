import { Entity } from '../../core/entities/entity'
import { UniqueEntityID } from '../../core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'

interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId: UniqueEntityID
  slug?: Slug
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }
}
