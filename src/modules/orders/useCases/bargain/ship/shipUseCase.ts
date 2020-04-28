import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { ShipDto } from './shipDto'
import { ShipErrors } from './shipErrors'


type Response = Either<AppError.UnexpectedError, Result<void>>


export class ShipUseCase implements UseCase<ShipDto, Promise<Response>> {
  private bargainRepo: IBargainRepo

  constructor(
    bargainRepo: IBargainRepo) {
    this.bargainRepo = bargainRepo
  }

  public async execute(request: ShipDto): Promise<Response> {
    try {
      const { _id, code, type } = request

      const bargain = await this.bargainRepo.getById(_id)
      if (!bargain) {
        return left(new ShipErrors.NotFoundErrors())
      }

      const barginResult = bargain.shipped(code, type)
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
