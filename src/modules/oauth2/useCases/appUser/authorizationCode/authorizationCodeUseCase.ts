import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import uuid from 'uuid/v4';
import { AppUser } from '../../../domain/appUser'
import { IAppUserRepo } from '../../../repos/appUserRepo'
import { AuthorizationCodeDto } from './authorizationCodeDto';
import { IAuthCodeRepo } from '../../../repos/authCodeRepo';
import { IThirdPartyAppRepo } from '../../../repos/thirdPartyAppRepo';
import { CreateAppUserUseCase } from '../createAppUser/createAppUserUseCase';
import { AuthorizationCodeErrors } from './authorizationCodeErrors';

type Response = Either<
  AppError.UnexpectedError |
  AuthorizationCodeErrors.DoseNotExistAppId |
  AuthorizationCodeErrors.AppSecretDotMatch |
  AuthorizationCodeErrors.DoseNotExistCode |
  AuthorizationCodeErrors.CodeExpired |
  AuthorizationCodeErrors.DoseNotExistAppUser
  , Result<AppUser>>

export class AuthorizationCodeUseCase implements UseCase<AuthorizationCodeDto, Promise<Response>> {
  private appUserRepo: IAppUserRepo
  private authCodeRepo: IAuthCodeRepo
  private thirdPartyAppRepo: IThirdPartyAppRepo

  constructor(
    appUserRepo: IAppUserRepo,
    authCodeRepo: IAuthCodeRepo,
    thirdPartyAppRepo: IThirdPartyAppRepo) {
    this.appUserRepo = appUserRepo
    this.authCodeRepo = authCodeRepo
    this.thirdPartyAppRepo = thirdPartyAppRepo
  }

  public async execute(request: AuthorizationCodeDto): Promise<Response> {
    try {
      const { appId, secret, code, grantType } = request

      const thirdPartyApp = await this.thirdPartyAppRepo.getThirdPartyAppByAppId(appId)
      if (!thirdPartyApp) {
        //不存在此appId
        return left(new AuthorizationCodeErrors.DoseNotExistAppId())
      }

      if (thirdPartyApp.secret !== secret) {
        //密钥错误
        return left(new AuthorizationCodeErrors.AppSecretDotMatch())
      }

      const authCode = await this.authCodeRepo.getAuthCodeByAppIdWithCode(appId, code)
      if (!authCode) {
        //不存在此Code
        return left(new AuthorizationCodeErrors.DoseNotExistCode())
      }

      if (authCode.createAt + authCode.expiresIn < Date.now()) {
        //code已过期
        return left(new AuthorizationCodeErrors.CodeExpired())
      }

      let appUser = await this.appUserRepo.getAppUserByAppIdWithUserId(authCode.appId, authCode.userId)
      if (!appUser) {
        //openUser不存在
        return left(new AuthorizationCodeErrors.DoseNotExistAppUser())
      }

      return right(Result.ok<AppUser>(appUser))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}


