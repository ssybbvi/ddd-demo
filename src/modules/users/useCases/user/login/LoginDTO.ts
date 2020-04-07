import { RefreshToken, JWTToken } from '../../../domain/jwt'

export interface LoginDTO {
  userId: string
}

export interface LoginDTOResponse {
  accessToken: JWTToken
  refreshToken: RefreshToken
}
