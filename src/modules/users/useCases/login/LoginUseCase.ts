import { LoginDTO, LoginDTOResponse } from './LoginDTO'
import { LoginUseCaseErrors } from './LoginErrors'
import { AppError } from '../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../shared/core/Result'
import { UseCase } from '../../../../shared/core/UseCase'
import { IUserRepo } from '../../repos/userRepo'
import { IAuthService } from '../../services/authService'
import { User } from '../../domain/user'
import { JWTToken, RefreshToken } from '../../domain/jwt'
import { UpUserName } from '../../domain/upUserName'
import { UpUserPassword } from '../../domain/upUserPassword'

type Response = Either<
  LoginUseCaseErrors.PasswordDoesntMatchError | LoginUseCaseErrors.UserNameDoesntExistError | AppError.UnexpectedError,
  Result<LoginDTOResponse>
>

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
  private userRepo: IUserRepo
  private authService: IAuthService

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo
    this.authService = authService
  }

  public async execute(request: LoginDTO): Promise<Response> {
    let user: User
    let userName: UpUserName
    let password: UpUserPassword

    try {
      const usernameOrError = UpUserName.create({ name: request.userName })
      const passwordOrError = UpUserPassword.create({ value: request.password })
      const payloadResult = Result.combine([usernameOrError, passwordOrError])

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.error))
      }

      userName = usernameOrError.getValue()
      password = passwordOrError.getValue()

      user = await this.userRepo.getUserByUserName(userName)
      const userFound = !!user

      // if (!userFound) {
      //   return left(new LoginUseCaseErrors.UserNameDoesntExistError())
      // }

      // const passwordValid = await user.password.comparePassword(password.value)

      // if (!passwordValid) {
      //   return left(new LoginUseCaseErrors.PasswordDoesntMatchError())
      // }

      // const accessToken: JWTToken = this.authService.signJWT({
      //   username: user.username.value,
      //   email: user.email.value,
      //   isEmailVerified: user.isEmailVerified,
      //   userId: user.userId.id.toString(),
      //   adminUser: user.isAdminUser
      // })

      // const refreshToken: RefreshToken = this.authService.createRefreshToken()

      // user.setAccessToken(accessToken, refreshToken)

      // await this.authService.saveAuthenticatedUser(user)

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken: '',
          refreshToken: ''
        })
      )
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
