import { UseCase } from '../../../../../shared/core/UseCase'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { ISignInRepo } from '../../../repos/signInRepo'
import { SignIn } from '../../../domain/signIn'
import { SignInCreated } from '../../../domain/events/signInCreated'
import { SignInDTO } from '../../../dtos/signInDTO'
import { GetRecentSignInDto } from './getRecentSignInDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<SignIn[]>>

export class GetRecentSignInUseCase implements UseCase<GetRecentSignInDto, Promise<Response>> {
  private signInRepo: ISignInRepo

  constructor(signInRepo: ISignInRepo) {
    this.signInRepo = signInRepo
  }

  public async execute(request: GetRecentSignInDto): Promise<Response> {
    try {
      let { memberId } = request
      let list = await this.signInRepo.filter(memberId, 5)
      return right(Result.ok<SignIn[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
