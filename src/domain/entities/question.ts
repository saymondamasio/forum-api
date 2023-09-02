import { Slug } from './value-objects/slug'
import { Entity } from '../../core/entities/Entity'

interface QuestionProps {
  id: string
  slug?: Slug
  title: string
  content: string
  authorId: string
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
