import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderUserRepo } from '../../../repos/orderUserRepo'
import { OrderUser } from '../../../domain/orderUser'
import { GetOrderUserDto } from './getOrderUserDto'


type Response = Either<AppError.UnexpectedError | Result<any>, Result<OrderUser>>

export class GetOrderUserUseCase implements UseCase<GetOrderUserDto, Promise<Response>> {
  private orderUserRepo: IOrderUserRepo

  constructor(orderUserRepo: IOrderUserRepo) {
    this.orderUserRepo = orderUserRepo
  }

  public async execute(request: GetOrderUserDto): Promise<Response> {
    try {
      const { userId } = request
      const orderUser = await this.orderUserRepo.getById(userId)
      console.log("zzzz", orderUser)
      return right(Result.ok<OrderUser>(orderUser))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
