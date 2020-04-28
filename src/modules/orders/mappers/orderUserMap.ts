import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { OrderUser } from '../domain/orderUser'
import { IOrderUserDto } from '../dtos/orderUserDto'
import { IOrderUserDbModel } from '../dbModels/orderUserDbModel'

export class OrderUserMap implements IMapper<OrderUser> {
  public static toDomain(raw: IOrderUserDbModel): OrderUser {
    if (!raw) {
      return null
    }

    const orderUserOrError = OrderUser.create(
      {
        isAllowBuyOnceCommodity: raw.isAllowBuyOnceCommodity
      },
      new UniqueEntityID(raw._id)
    )
    orderUserOrError.isFailure ? console.log(orderUserOrError.error) : ''
    return orderUserOrError.isSuccess ? orderUserOrError.getValue() : null
  }

  public static toPersistence(orderUser: OrderUser): IOrderUserDbModel {
    if (!orderUser) {
      return null
    }
    return {
      _id: orderUser.id.toString(),
      isAllowBuyOnceCommodity: orderUser.isAllowBuyOnceCommodity
    }
  }

  public static toDTO(orderUser: OrderUser): IOrderUserDto {
    if (!orderUser) {
      return null
    }
    return {
      isAllowBuyOnceCommodity: orderUser.isAllowBuyOnceCommodity
    }
  }
}
