import { IMapper } from '../../../shared/infra/Mapper'
import { User } from '../domain/user'
import { UserDTO, WxDTO } from '../dtos/userDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IUserDbModels, WxDbModel } from '../dbModels/iUserDbModels'
import { WxUser } from '../domain/wxUser'

export class UserMap implements IMapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      _id: user.userId.id.toString(),
      isDeleted: user.isDeleted,
      platform: {
        wx: this.wxUesrToDTO(user.platform.wx)
      }
    }
  }

  private static wxUesrToDTO(wxUser?: WxUser): WxDTO {
    if (!wxUser) {
      return null
    }
    return {
      openId: wxUser.props.openId,
      unionId: wxUser.props.unionId,
      sessionKey: wxUser.props.sessionKey
    }
  }

  public static toDomain(raw: IUserDbModels): User {
    const userOrError = User.create(
      {
        platform: {
          wx: this.wxUserToDomain(raw.platform.wx)
        }
      },
      new UniqueEntityID(raw._id)
    )

    userOrError.isFailure ? console.log(userOrError.error) : ''

    return userOrError.isSuccess ? userOrError.getValue() : null
  }

  private static wxUserToDomain(raw?: WxDbModel): WxUser {
    if (!raw) {
      return null
    }

    let wxUserOrError = WxUser.create({
      openId: raw.openId,
      unionId: raw.unionId,
      sessionKey: raw.sessionKey
    })

    wxUserOrError.isFailure ? console.log(wxUserOrError.error) : ''

    return wxUserOrError.getValue()
  }

  public static async toPersistence(user: User): Promise<IUserDbModels> {
    return {
      _id: user.userId.id.toString(),
      isDeleted: user.isDeleted,
      platform: {
        wx: this.toWxUserPersistence(user.platform.wx)
      }
    }
  }

  private static toWxUserPersistence(wxUser?: WxUser): WxDbModel {
    if (!wxUser) {
      return null
    }
    return {
      openId: wxUser.value.openId,
      unionId: wxUser.value.unionId,
      sessionKey: wxUser.value.sessionKey
    }
  }

  public static toLoginMe(user: User) {
    return {
      id: user.id.toString()
    }
  }
}
