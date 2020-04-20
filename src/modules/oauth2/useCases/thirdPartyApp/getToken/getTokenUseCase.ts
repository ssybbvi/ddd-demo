import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IThirdPartyAppRepo } from '../../../repos/thirdPartyAppRepo'
import { GetTokenDto } from './getTokenDto'
import { ThirdPartyApp } from '../../../domain/thirdPartyApp'
import { GetTokenErrors } from './getTokenErrors'

type Response = Either<AppError.UnexpectedError | GetTokenErrors.AppSecretDotMatch | GetTokenErrors.DoseNotExistAppId, Result<ThirdPartyApp>>

export class GetTokenUseCase implements UseCase<GetTokenDto, Promise<Response>> {
  private thirdPartyAppRepo: IThirdPartyAppRepo

  constructor(thirdPartyAppRepo: IThirdPartyAppRepo) {
    this.thirdPartyAppRepo = thirdPartyAppRepo
  }

  public async execute(request: GetTokenDto): Promise<Response> {
    try {
      const { appId, secret } = request
      const thirdPartyApp = await this.thirdPartyAppRepo.getThirdPartyAppByAppId(appId)
      if (!thirdPartyApp) {
        return left(new GetTokenErrors.DoseNotExistAppId())
      }

      if (thirdPartyApp.secret != secret) {
        return left(new GetTokenErrors.AppSecretDotMatch())
      }

      thirdPartyApp.login()
      await this.thirdPartyAppRepo.save(thirdPartyApp)
      return right(Result.ok<ThirdPartyApp>(thirdPartyApp))

    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
