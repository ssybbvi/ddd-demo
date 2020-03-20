import { Either, Result, right, left } from '../../../../shared/core/Result'
import { AppError } from '../../../../shared/core/AppError'
import { UseCase } from '../../../../shared/core/UseCase'
import { Order } from '../../domain/order'
import { CreateOrderDto } from './createOrderDto'
import { OrderAddress } from '../../domain/orderAddress'
import { IOrderRepo } from '../../repos/orderRepo'
import { commodityRepo } from '../../../commoditys/repos'
import { ICommodityRepo } from '../../../commoditys/repos/iCommodityRepo'
 
import { OrderItem } from '../../domain/orderItem'
import { OrderItemDto } from '../../dtos/orderItemDto'
import { CreateOrderErrors } from './createOrderErrors'

type Response = Either<CreateOrderErrors.CommodityNotFound
| CreateOrderErrors.OrderItemNotNull
| AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateOrderUseCase implements UseCase<CreateOrderDto, Promise<Response>> {
  private orderRepo: IOrderRepo
  private commodityRepo:ICommodityRepo

  constructor(orderRepo: IOrderRepo,commodityRepo:ICommodityRepo) {
    this.orderRepo = orderRepo
    this.commodityRepo=commodityRepo
  }

  public async execute(request: CreateOrderDto): Promise<Response> {
    try {
      const {
        memberId,
        remark,

        userName,
        provinceName ,
        cityName ,
        countyName ,
        detailAddressInfo ,
        nationalCode ,
        telNumber ,
    
        items
      } = request

      const orderAddressOrErrors=  OrderAddress.create({
        userName:userName,
        provinceName : provinceName,
        cityName : cityName,
        countyName : countyName,
        detailAddressInfo :detailAddressInfo,
        nationalCode : nationalCode,
        telNumber :telNumber,
      })
  
      if(orderAddressOrErrors.isFailure){
          return left(orderAddressOrErrors)
      }

      if(!!items===false||items.length===0){
        return left(new  CreateOrderErrors.OrderItemNotNull())
      }

      let orderItemList:OrderItem[]=[]
      for(let item of items){
          
        let commodity=await commodityRepo.getById(item.commodityId)
        if(!!commodity===false){
            return left(new CreateOrderErrors.CommodityNotFound(item.commodityId))
        }

        let orderItemOrErrors= OrderItem.create({
            name:commodity.name,
            price:commodity.price,
            image:commodity.images?commodity.images[0]:"",
            commodityId:item.commodityId
        })

        if(orderItemOrErrors.isFailure){
            return left (orderItemOrErrors)
        }
        orderItemList.push(orderItemOrErrors.getValue())
      }


      const orderOrErrors = Order.create({
        memberId:memberId,
        status:'unpaid',
        remark:remark,
        orderAddress:orderAddressOrErrors.getValue(),
        items:orderItemList,
      })

      if (orderOrErrors.isFailure) {
        return left(orderOrErrors)
      }

      await this.orderRepo.save(orderOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
