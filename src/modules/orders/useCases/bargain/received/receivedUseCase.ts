import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { ReceivedDto } from './receivedDto'
import { ReceivedErrors } from './receivedErrors'


type Response = Either<AppError.UnexpectedError, Result<void>>


export class ReceivedUseCase implements UseCase<ReceivedDto, Promise<Response>> {
  private bargainRepo: IBargainRepo

  constructor(
    bargainRepo: IBargainRepo) {
    this.bargainRepo = bargainRepo
  }


  public async execute(request: ReceivedDto): Promise<Response> {
    try {
      const { _id } = request

      const bargain = await this.bargainRepo.getById(_id)
      if (!bargain) {
        return left(new ReceivedErrors.NotFoundErrors())
      }

      const barginResult = bargain.received()
      if (barginResult.isLeft()) {
        return left(barginResult.value)
      }

      await this.bargainRepo.save(bargain)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
