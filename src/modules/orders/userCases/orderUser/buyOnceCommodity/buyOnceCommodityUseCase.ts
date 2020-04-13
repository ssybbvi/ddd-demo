import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IOrderUserRepo } from '../../../repos/orderUserRepo'
import { OrderUser } from '../../../domain/orderUser'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { BuyOnceCommodityDto } from './buyOnceCommodityDto'


type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class BuyOnceCommodityUseCase implements UseCase<BuyOnceCommodityDto, Promise<Response>> {
  private orderUserRepo: IOrderUserRepo

  constructor(orderUserRepo: IOrderUserRepo) {
    this.orderUserRepo = orderUserRepo
  }

  public async execute(request: BuyOnceCommodityDto): Promise<Response> {
    try {
      const { userId } = request

      const orderUser = await this.orderUserRepo.getById(userId)
      orderUser.buyOnceCommodity()
      await this.orderUserRepo.save(orderUser)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
