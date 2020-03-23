import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Entity } from '../../../shared/domain/Entity'

export class AuthorityUserId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id)
  }

  public static create(id?: UniqueEntityID): Result<AuthorityUserId> {
    return Result.ok<AuthorityUserId>(new AuthorityUserId(id))
  }
}
