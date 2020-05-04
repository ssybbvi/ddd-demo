import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { ShipDto } from './shipDto'
import { ShipErrors } from './shipErrors'
import { RepeatShipmentError } from '../../../domain/deliveryInfo'
import { NotSeccessError } from '../../../domain/bargain'

type Response = Either<NotSeccessError | RepeatShipmentError | Result<any>, Result<void>>

export class ShipUseCase implements UseCase<ShipDto, Promise<Response>> {
  private bargainRepo: IBargainRepo

  constructor(bargainRepo: IBargainRepo) {
    this.bargainRepo = bargainRepo
  }

  public async execute(request: ShipDto): Promise<Response> {
    try {
      const { _id, code, type } = request

      const bargain = await this.bargainRepo.getById(_id)
      if (!bargain) {
        return left(new ShipErrors.NotFoundErrors())
      }

      const bargainResult = bargain.shipped(code, type)
      if (bargainResult.isLeft()) {
        return left(bargainResult.value)
      }
      await this.bargainRepo.save(bargain)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
