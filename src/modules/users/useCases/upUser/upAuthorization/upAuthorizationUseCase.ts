import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { UpUserName } from '../../../domain/upUserName'
import { UpUserPassword } from '../../../domain/upUserPassword'
import { UpAuthorizationDto } from './upAuthorizationDto'
import { UpAuthorizationErrors } from './upAuthorizationErrors'
import { UpUser } from '../../../domain/upUser'
import { IUpUserRepo } from '../../../repos/upUserRepo'
import { LoginDTOResponse } from '../../user/login/LoginDTO'
import { LoginUserUseCase } from '../../user/login/LoginUseCase'

type Response = Either<
  | UpAuthorizationErrors.PasswordDoesntMatchError
  | UpAuthorizationErrors.UserNameDoesntExistError
  | AppError.UnexpectedError,
  Result<LoginDTOResponse>
>

export class UpAuthorizationUseCase implements UseCase<UpAuthorizationDto, Promise<Response>> {
  private upUserRepo: IUpUserRepo
  private loginUserUseCase: LoginUserUseCase

  constructor(upUserRepo: IUpUserRepo, loginUserUseCase: LoginUserUseCase) {
    this.upUserRepo = upUserRepo
    this.loginUserUseCase = loginUserUseCase
  }

  public async execute(request: UpAuthorizationDto): Promise<Response> {
    try {
      const usernameOrError = UpUserName.create({ name: request.userName })
      const passwordOrError = UpUserPassword.create({ value: request.password })
      const payloadResult = Result.combine([usernameOrError, passwordOrError])

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.error))
      }

      const userName: UpUserName = usernameOrError.getValue()
      const password: UpUserPassword = passwordOrError.getValue()

      const upUser: UpUser = await this.upUserRepo.getUserByUserName(userName)
      const userFound = !!upUser

      if (!userFound) {
        return left(new UpAuthorizationErrors.UserNameDoesntExistError())
      }

      const passwordValid = await upUser.password.comparePassword(password.value)

      if (!passwordValid) {
        return left(new UpAuthorizationErrors.PasswordDoesntMatchError())
      }

      const loginUserUseCaseResult = await this.loginUserUseCase.execute({
        userId: upUser.id.toString()
      })

      if (loginUserUseCaseResult.isLeft()) {
        return left(loginUserUseCaseResult.value)
      }

      const loginDTOResponse = loginUserUseCaseResult.value.getValue() as LoginDTOResponse
      return right(Result.ok<LoginDTOResponse>(loginDTOResponse))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
