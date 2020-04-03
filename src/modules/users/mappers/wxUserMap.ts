import { WxUser } from '../domain/wxUser'
import { IWxUserDbModels } from '../dbModels/iWxUserDbModels'
import { WxUserDTO } from '../dtos/wxUserDto'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'

export class WxUserMap {
  static toDTO(wxUser?: WxUser): WxUserDTO {
    if (!wxUser) {
      return null
    }
    return {
      openId: wxUser.props.openId,
      unionId: wxUser.props.unionId,
      sessionKey: wxUser.props.sessionKey,
      nickName: wxUser.props.nickName,
      avatarUrl: wxUser.props.avatarUrl,
      gender: wxUser.props.gender
    }
  }

  static toDomain(raw?: IWxUserDbModels): WxUser {
    if (!raw) {
      return null
    }

    let wxUserOrError = WxUser.create(
      {
        openId: raw.openId,
        unionId: raw.unionId,
        sessionKey: raw.sessionKey,
        nickName: raw.nickName,
        avatarUrl: raw.avatarUrl,
        gender: raw.gender
      },
      new UniqueEntityID(raw._id)
    )

    wxUserOrError.isFailure ? console.log(wxUserOrError.error) : ''

    return wxUserOrError.getValue()
  }

  static toPersistence(wxUser?: WxUser): IWxUserDbModels {
    if (!wxUser) {
      return null
    }
    return {
      _id: wxUser.id.toString(),
      openId: wxUser.openId,
      unionId: wxUser.unionId,
      sessionKey: wxUser.sessionKey,
      nickName: wxUser.nickName,
      avatarUrl: wxUser.avatarUrl,
      gender: wxUser.gender
    }
  }
}
