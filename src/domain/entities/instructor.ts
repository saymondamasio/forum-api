import { Entity } from '../../core/entities/entity'
import { UniqueEntityID } from '../../core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  get name() {
    return this.props.name
  }

  static create(props: Instructor, id?: UniqueEntityID) {
    const instructor = new Instructor(props, id)

    return instructor
  }
}
