import { JWTToken, RefreshToken } from '../domain/jwt'

export interface IUserDbModels {
  _id: string
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
}
