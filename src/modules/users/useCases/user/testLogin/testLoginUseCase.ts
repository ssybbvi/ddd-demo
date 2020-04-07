import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { TestLoginDto } from './testLoginDto'
import { LoginUserUseCase } from '../login/LoginUseCase'
import { LoginDTOResponse } from '../login/LoginDTO'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<LoginDTOResponse>>

export class TestLoginUseCase implements UseCase<TestLoginDto, Promise<Response>> {
  private loginUserUseCase: LoginUserUseCase

  constructor(loginUserUseCase: LoginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase
  }

  public async execute(request: TestLoginDto): Promise<Response> {
    const { userId } = request
    try {
      const loginUserUseCaseResult = await this.loginUserUseCase.execute({
        userId
      })

      const loginUserUseCaseResultValue = loginUserUseCaseResult.value
      if (loginUserUseCaseResult.isLeft()) {
        return left(loginUserUseCaseResultValue)
      }

      const loginDTOResponse = loginUserUseCaseResultValue.getValue() as LoginDTOResponse
      return right(Result.ok<LoginDTOResponse>(loginDTOResponse))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
