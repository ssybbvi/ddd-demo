import { AppError } from '../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../shared/core/Result'
import { UseCase } from '../../../../shared/core/UseCase'
import { IUserRepo } from '../../repos/userRepo'
import { IAuthService } from '../../services/authService'
import { User } from '../../domain/user'
import { JWTToken, RefreshToken } from '../../domain/jwt'
import { AuthorizationService } from '../../services/authorizationService'
import { WxAuthrizationService, WxJsCodeToSessionResult } from '../../services/wxAuthrizationService'
import { WxUser } from '../../domain/wxUser'
import { TestLoginDto } from './testLoginDto'
import { WxAuthorizationDtoResult } from '../wxAuthorization/wxAuthorizationDtoResult'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<WxAuthorizationDtoResult>>

export class TestLoginUseCase implements UseCase<TestLoginDto, Promise<Response>> {
  private userRepo: IUserRepo
  private authorizationService: AuthorizationService

  constructor(userRepo: IUserRepo, authorizationService: AuthorizationService) {
    this.userRepo = userRepo
    this.authorizationService = authorizationService
  }

  public async execute(request: TestLoginDto): Promise<Response> {
    try {
      let user = await this.userRepo.getById(request.userId)
      let loginDTOResponse: WxAuthorizationDtoResult = await this.authorizationService.getAceessTokenWithRefreshToken(
        user
      )

      return right(Result.ok<WxAuthorizationDtoResult>(loginDTOResponse))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
