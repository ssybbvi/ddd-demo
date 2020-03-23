import { IMapper } from '../../../shared/infra/Mapper'
import { AuthorityUser } from '../domain/authorityUser'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { UserName } from '../../users/domain/userName'
import { UserId } from '../../users/domain/userId'
import { IAuthorityUserDbModel } from '../dbModels/iAuthorityUserDbModel'

export class AuthorityUserMap implements IMapper<AuthorityUser> {
  public static toDomain(raw: IAuthorityUserDbModel): AuthorityUser {


    const authorityUserOrError = AuthorityUser.create(
      {
        name:raw.name,
        roleIds:[]
      },
      new UniqueEntityID(raw._id)
    )

    authorityUserOrError.isFailure ? console.log(authorityUserOrError.error) : ''

    return authorityUserOrError.isSuccess ? authorityUserOrError.getValue() : null
  }

  public static toPersistence(authorityUser: AuthorityUser): any {
    return {
      _id: authorityUser.authorityUserId.id.toString(),
    }
  }
}
