import { LoginDTO, LoginDTOResponse } from './LoginDTO'
import { LoginUseCaseErrors } from './LoginErrors'
import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IAuthService } from '../../../../../shared/infra/auth/authService'
import { IUserRepo } from '../../../repos/userRepo'
import { AppError } from '../../../../../shared/core/AppError'
import { RefreshToken, JWTToken } from '../../../domain/jwt'

type Response = Either<AppError.UnexpectedError, Result<LoginDTOResponse>>

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
  private userRepo: IUserRepo
  private authService: IAuthService

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo
    this.authService = authService
  }

  public async execute(request: LoginDTO): Promise<Response> {
    const { userId, tenantId } = request
    try {
      const user = await this.userRepo.getById(userId)

      const refreshToken: RefreshToken = this.authService.createRefreshToken()
      const accessToken: JWTToken = this.authService.signJWT({
        userId: userId,
        tenantId
      })

      user.setAccessToken(accessToken, refreshToken)
      await this.authService.saveAuthenticatedUser(user)
      await this.userRepo.save(user)

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken,
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
