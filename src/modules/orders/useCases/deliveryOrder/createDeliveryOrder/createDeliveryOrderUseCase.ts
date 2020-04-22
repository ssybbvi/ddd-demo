import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IDeliveryOrderRepo } from '../../../repos/deliveryOrderRepo'
import { DeliveryOrder } from '../../../domain/deliveryOrder'
import { CreateDeliveryOrderDto } from './createDeliveryOrderDto'


type Response = Either<AppError.UnexpectedError, Result<void>>

export class CreateDeliveryOrderUseCase implements UseCase<CreateDeliveryOrderDto, Promise<Response>> {
  private deliveryOrderRepo: IDeliveryOrderRepo

  constructor(
    deliveryOrderRepo: IDeliveryOrderRepo) {
    this.deliveryOrderRepo = deliveryOrderRepo
  }

  public async execute(request: CreateDeliveryOrderDto): Promise<Response> {
    try {
      const {
        orderId,
        address
      } = request

      const deliveryOrderOrErrors = DeliveryOrder.create({
        orderId: orderId,
        address: address
      })

      if (deliveryOrderOrErrors.isFailure) {
        return left(deliveryOrderOrErrors)
      }

      await this.deliveryOrderRepo.save(deliveryOrderOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }



}
