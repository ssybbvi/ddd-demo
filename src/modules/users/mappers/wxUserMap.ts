import { WxUser } from '../domain/wxUser'
import { IWxUserDbModels } from '../dbModels/iWxUserDbModels'
import { WxUserDTO } from '../dtos/wxUserDto'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'

export class WxUserMap {
  static async toListDto(wxUserList: WxUser[]): Promise<WxUserDTO[]> {
    const wxUserDtoList = []
    for (let item of wxUserList) {
      wxUserDtoList.push(await this.toDTO(item))
    }
    return wxUserDtoList
  }

  static async toDTO(wxUser?: WxUser): Promise<WxUserDTO> {
    if (!wxUser) {
      return null
    }
    return {
      _id: wxUser.id.toString(),
      nickName: wxUser.nickName,
      avatarUrl: wxUser.avatarUrl,
      gender: wxUser.gender,
      phoneNumber: wxUser.phoneNumber
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
        gender: raw.gender,
        phoneNumber: raw.phoneNumber
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
      gender: wxUser.gender,
      phoneNumber: wxUser.phoneNumber
    }
  }
}
