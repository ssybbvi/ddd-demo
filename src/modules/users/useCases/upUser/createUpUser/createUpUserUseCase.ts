import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { UpUserName } from '../../../domain/upUserName'
import { UpUserPassword } from '../../../domain/upUserPassword'
import { UpUser } from '../../../domain/upUser'
import { IUpUserRepo } from '../../../repos/upUserRepo'
import { CreateUpUserUseDto } from './createUpUserDto'
import { CreateUpUserErrors } from './createUpUserErrors'

type Response = Either<CreateUpUserErrors.UserNameExistError | AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateUpUseCase implements UseCase<CreateUpUserUseDto, Promise<Response>> {
  private upUserRepo: IUpUserRepo

  constructor(upUserRepo: IUpUserRepo) {
    this.upUserRepo = upUserRepo
  }

  public async execute(request: CreateUpUserUseDto): Promise<Response> {
    try {
      const usernameOrError = UpUserName.create({ name: request.userName })
      const passwordOrError = UpUserPassword.create({ value: request.password })
      const payloadResult = Result.combine([usernameOrError, passwordOrError])

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.error))
      }

      let userName: UpUserName = usernameOrError.getValue()
      let password: UpUserPassword = passwordOrError.getValue()

      let upUser: UpUser = await this.upUserRepo.getUserByUserName(userName)
      const userFound = !!upUser

      if (userFound) {
        return left(new CreateUpUserErrors.UserNameExistError())
      }

      const newUpUserOrError = UpUser.create({
        userName: userName,
        password: password
      })

      if (newUpUserOrError.isFailure) {
        return left(newUpUserOrError)
      }

      await this.upUserRepo.save(newUpUserOrError.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
