import { JWTToken, RefreshToken } from '../domain/jwt'

export interface IUserDbModels {
  _id: string
  accessToken?: JWTToken
  refreshToken?: RefreshToken
  isDeleted?: boolean
  lastLogin?: number
  inviteRecommendedUserId?: string
  createAt: number
  inviteToken: string
}
