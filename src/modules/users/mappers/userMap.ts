import { IMapper } from '../../../shared/infra/Mapper'
import { User } from '../domain/user'
import { UserDTO } from '../dtos/userDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IUserDbModels } from '../dbModels/iUserDbModels'

export class UserMap implements IMapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      _id: user.userId.id.toString(),
      lastLogin: user.lastLogin,
      createAt: user.createAt,
      inviteToken: user.inviteToken,
      inviteRecommendedUserId: user.inviteRecommendedUserId
    }
  }

  public static toDomain(raw: IUserDbModels): User {
    const userOrError = User.create(
      {
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
        isDeleted: raw.isDeleted,
        lastLogin: new Date(raw.lastLogin),
        createAt: raw.createAt,
        inviteToken: raw.inviteToken,
        inviteRecommendedUserId: raw.inviteRecommendedUserId
      },
      new UniqueEntityID(raw._id)
    )

    userOrError.isFailure ? console.log(userOrError.error) : ''

    return userOrError.isSuccess ? userOrError.getValue() : null
  }

  public static async toPersistence(user: User): Promise<IUserDbModels> {
    return {
      _id: user.userId.id.toString(),
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      isDeleted: user.isDeleted,
      createAt: user.createAt,
      inviteToken: user.inviteToken,
      inviteRecommendedUserId: user.inviteRecommendedUserId
    }
  }

  public static toLoginMe(user: User) {
    return {
      id: user.id.toString()
    }
  }
}
