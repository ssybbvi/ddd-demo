import { User } from '../domain/user'
import { JWTToken, RefreshToken } from '../domain/jwt'
import { IAuthService } from './authService'
import { WxAuthorizationDtoResult } from '../useCases/wxAuthorization/wxAuthorizationDtoResult'

export class AuthorizationService {
  private authService: IAuthService
  constructor(authService: IAuthService) {
    this.authService = authService
  }

  private getRefreshTokenForUser(): RefreshToken {
    const refreshToken: RefreshToken = this.authService.createRefreshToken()
    return refreshToken
  }

  private getAccessTokenForUser(user: User): JWTToken {
    const accessToken: JWTToken = this.authService.signJWT({
      userId: user.userId.id.toString()
    })
    return accessToken
  }

  public async getAceessTokenWithRefreshToken(user: User): Promise<WxAuthorizationDtoResult> {
    const accessToken: JWTToken = this.getAccessTokenForUser(user)
    const refreshToken: RefreshToken = this.getRefreshTokenForUser()
    await this.authService.saveAuthenticatedUser(user)
    return {
      accessToken,
      refreshToken
    } as WxAuthorizationDtoResult
  }
}
