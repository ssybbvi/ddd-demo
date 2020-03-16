import { JWTToken, RefreshToken } from '../domain/jwt'

export interface IUserDbModels {
  _id: string
  from: string
  accessToken?: JWTToken
  refreshToken?: RefreshToken
  isDeleted?: boolean
  lastLogin?: number
  platform: {
    wx?: WxDbModel
  }
}

export interface WxDbModel {
  openId: string
  unionId: string
  sessionKey: string
  nickName?: string
  avatarUrl?: string
  gender?: number
}
