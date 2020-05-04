import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderUserRepo } from '../../../repos/orderUserRepo'
import { OrderUser } from '../../../domain/orderUser'
import { CreateOrderUserDto } from './createOrderUserDto'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'

type Response = Either<AppError.UnexpectedError | Result<OrderUser>, Result<void>>

export class CreateOrderUserUseCase implements UseCase<CreateOrderUserDto, Promise<Response>> {
  private orderUserRepo: IOrderUserRepo

  constructor(orderUserRepo: IOrderUserRepo) {
    this.orderUserRepo = orderUserRepo
  }

  public async execute(request: CreateOrderUserDto): Promise<Response> {
    try {
      const { userId } = request

      const orderUserOrErrors = OrderUser.create({ isAllowBuyOnceCommodity: true }, new UniqueEntityID(userId))
      if (orderUserOrErrors.isFailure) {
        return left(orderUserOrErrors)
      }

      await this.orderUserRepo.save(orderUserOrErrors.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
