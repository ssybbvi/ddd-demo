import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { TestLoginDto } from './testLoginDto'
import { LoginUserUseCase } from '../login/LoginUseCase'
import { LoginDTOResponse } from '../login/LoginDTO'

type Response = Either<AppError.UnexpectedError, Result<LoginDTOResponse>>

export class TestLoginUseCase implements UseCase<TestLoginDto, Promise<Response>> {
  private loginUserUseCase: LoginUserUseCase

  constructor(loginUserUseCase: LoginUserUseCase) {
    this.loginUserUseCase = loginUserUseCase
  }

  public async execute(request: TestLoginDto): Promise<Response> {
    const { userId } = request
    try {
      const loginUserUseCaseResult = await this.loginUserUseCase.execute({
        userId,
        tenantId: "29a9fa5f-05d8-473f-a01c-13e3771c80c7"
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
