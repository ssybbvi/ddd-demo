import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { CreateAuthCodeDto } from './createAuthCodeDto'
import { IAuthCodeRepo } from '../../../repos/authCodeRepo'
import { AuthCode } from '../../../domain/authCode'
import { IThirdPartyAppRepo } from '../../../repos/thirdPartyAppRepo'
import { CreateAuthCodeErrors } from './createAuthCodeErrors'

type Response = Either<AppError.UnexpectedError | CreateAuthCodeErrors.DoseNotExistAppId, Result<AuthCode>>

export class CreateAuthCodeUseCase implements UseCase<CreateAuthCodeDto, Promise<Response>> {
  private authCodeRepo: IAuthCodeRepo
  private thirdPartyAppRepo: IThirdPartyAppRepo

  constructor(authCodeRepo: IAuthCodeRepo, thirdPartyAppRepo: IThirdPartyAppRepo) {
    this.authCodeRepo = authCodeRepo
    this.thirdPartyAppRepo = thirdPartyAppRepo
  }

  public async execute(request: CreateAuthCodeDto): Promise<Response> {
    try {
      const { appId, userId } = request
      const isExistThirdPartApp = await this.thirdPartyAppRepo.existAppId(appId)
      if (!isExistThirdPartApp) {
        return left(new CreateAuthCodeErrors.DoseNotExistAppId())
      }

      const authCode = await this.authCodeRepo.getAuthCodeByAppIdWithUserId(appId, userId)
      if (authCode) {
        authCode.refreshExpiresIn()
        await this.authCodeRepo.save(authCode)
        return right(Result.ok<AuthCode>(authCode))
      } else {
        const authCodeOrError = AuthCode.create({
          appId,
          userId,
        })

        if (authCodeOrError.isFailure) {
          return left(authCodeOrError)
        }
        const authCode = authCodeOrError.getValue()
        await this.authCodeRepo.save(authCode)
        return right(Result.ok<AuthCode>(authCode))
      }
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
