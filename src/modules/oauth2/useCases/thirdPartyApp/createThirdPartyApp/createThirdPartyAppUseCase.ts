import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IThirdPartyAppRepo } from '../../../repos/thirdPartyAppRepo'
import { CreateThirdPartyAppDto } from './createThirdPartyAppDto'
import { ThirdPartyApp } from '../../../domain/thirdPartyApp'
import uuid from 'uuid/v4';
import { CreateThirdPartyAppErrors } from './createThirdPartErrors'

type Response = Either<AppError.UnexpectedError | CreateThirdPartyAppErrors.ExistName, Result<void>>

export class CreateThirdPartyAppUseCase implements UseCase<CreateThirdPartyAppDto, Promise<Response>> {
  private thirdPartyAppRepo: IThirdPartyAppRepo

  constructor(thirdPartyAppRepo: IThirdPartyAppRepo) {
    this.thirdPartyAppRepo = thirdPartyAppRepo
  }

  public async execute(request: CreateThirdPartyAppDto): Promise<Response> {
    try {
      const { name } = request
      const isExists = await this.thirdPartyAppRepo.existName(name)
      if (isExists) {
        return left(new CreateThirdPartyAppErrors.ExistName())
      }

      const appId = uuid()
      const secret = uuid()
      const thirdPartyAppOrError = ThirdPartyApp.create({ name, appId, secret })
      if (thirdPartyAppOrError.isFailure) {
        return left(thirdPartyAppOrError)
      }

      await this.thirdPartyAppRepo.save(thirdPartyAppOrError.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
