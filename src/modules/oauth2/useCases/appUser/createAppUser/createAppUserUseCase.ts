import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import uuid from 'uuid/v4'
import { CreateAppUserDto } from './createAppUserDto'
import { AppUser } from '../../../domain/appUser'
import { IAppUserRepo } from '../../../repos/appUserRepo'
import { CreateAppUserErrors } from './createAppUserErrors'

type Response = Either<
  AppError.UnexpectedError | Result<AppUser> | CreateAppUserErrors.ExistUserOpenId,
  Result<AppUser>
>

export class CreateAppUserUseCase implements UseCase<CreateAppUserDto, Promise<Response>> {
  private appUserRepo: IAppUserRepo

  constructor(appUserRepo: IAppUserRepo) {
    this.appUserRepo = appUserRepo
  }

  public async execute(request: CreateAppUserDto): Promise<Response> {
    try {
      const { appId, userId } = request
      const isExistAppUserByAppIdWithUserId = await this.appUserRepo.getAppUserByAppIdWithUserId(appId, userId)
      if (isExistAppUserByAppIdWithUserId) {
        return left(new CreateAppUserErrors.ExistUserOpenId())
      }

      const openUserId = uuid()
      const appUserOrError = AppUser.create({
        appId,
        openUserId,
        userId,
      })

      if (appUserOrError.isFailure) {
        return left(appUserOrError)
      }

      const appUser = appUserOrError.getValue()
      await this.appUserRepo.save(appUser)
      return right(Result.ok<AppUser>(appUser))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
