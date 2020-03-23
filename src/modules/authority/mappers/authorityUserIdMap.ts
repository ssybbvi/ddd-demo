import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { AuthorityUserId } from '../domain/authorityUserId'

export class AuthorityUserIdMap implements IMapper<AuthorityUserId> {
  public static toDomain(rawAuthorityUser: any): AuthorityUserId {
    const authorityUserIdOrError = AuthorityUserId.create(new UniqueEntityID(rawAuthorityUser.authorityUser_id))
    return authorityUserIdOrError.isSuccess ? authorityUserIdOrError.getValue() : null
  }
}
