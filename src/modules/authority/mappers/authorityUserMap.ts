import { IMapper } from '../../../shared/infra/Mapper'
import { AuthorityUser } from '../domain/authorityUser'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IAuthorityUserDbModel } from '../dbModels/iAuthorityUserDbModel'
import { RoleId } from '../domain/roleId'
import { AuthorityUserDTO } from '../dtos/authorityUserDTO'

export class AuthorityUserMap implements IMapper<AuthorityUser> {
  public static toDomain(raw: IAuthorityUserDbModel): AuthorityUser {

    const roleIds = raw.roleIds.map(item => {
      return RoleId.create(new UniqueEntityID(item)).getValue()
    })

    const authorityUserOrError = AuthorityUser.create(
      {
        name: raw.name,
        roleIds: roleIds
      },
      new UniqueEntityID(raw._id)
    )

    authorityUserOrError.isFailure ? console.log(authorityUserOrError.error) : ''

    return authorityUserOrError.isSuccess ? authorityUserOrError.getValue() : null
  }

  public static toPersistence(authorityUser: AuthorityUser): IAuthorityUserDbModel {
    return {
      _id: authorityUser.authorityUserId.id.toString(),
      name: authorityUser.name,
      roleIds: authorityUser.roleIds.map(item => item.id.toString())
    }
  }

  public static toDTO(authorityUser: AuthorityUser): AuthorityUserDTO {
    return {
      _id: authorityUser.authorityUserId.id.toString(),
      name: authorityUser.name,
      roleIds: authorityUser.roleIds.map(item => item.id.toString())
    }
  }
}
