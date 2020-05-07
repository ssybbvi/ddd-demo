import { JWTToken, JWTClaims, RefreshToken, TenantJwtClaims } from '../../../modules/users/domain/jwt'
import { User } from '../../../modules/users/domain/user'

export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken
  decodeJWT(token: string): Promise<JWTClaims>
  signTenantJWT(props: TenantJwtClaims)
  decodeTenantJWT(token: string): Promise<TenantJwtClaims>
  createRefreshToken(): RefreshToken
  getTokens(username: string): Promise<string[]>
  saveAuthenticatedUser(user: User): Promise<void>
  deAuthenticateUser(username: string): Promise<void>
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>
  getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string>
}
