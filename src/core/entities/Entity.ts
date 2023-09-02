import { randomUUID } from 'node:crypto'

export class Entity<Props> {
  private _id: string
  protected props: Props

  constructor(props: Props, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }

  get id() {
    return this._id
  }
}
