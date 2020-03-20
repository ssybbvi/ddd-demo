import { IMapper } from '../../../shared/infra/Mapper'
import { Order } from '../domain/order'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { OrderAddress } from '../domain/orderAddress'
import {OrderDto} from '../dtos/orderDto'
import { OrderItemDto } from '../dtos/orderItemDto'
import { OrderDbModel, OrderItemDbModel } from '../dbModels/orderDbModel'
import { OrderStatus } from '../domain/orderStatus'
import { OrderItem } from '../domain/orderItem'


export class OrderMap implements IMapper<Order> {
  public static toDTO(order: Order): OrderDto {
 
    const orderItemDtoList=order.orderItems.map(item=>this.orderItemToDTO(item))

    return {
        _id:order.id.toString(),
        memberId:order.memberId,
        createAt:order.createAt,
        status:order.status,
        price:order.price,
        remark:order.remark,
        code:order.code,
     
        userName:order.address.userName,
        provinceName : order.address.provinceName,
        cityName : order.address.cityName,
        countyName : order.address.countyName,
        detailAddressInfo :order.address.detailAddressInfo,
        nationalCode : order.address.nationalCode,
        telNumber :order.address.telNumber,

        paymentTime:order.paymentTime,
        cancelTime:order.cancelTime,
    
        customerServiceCancelTime:order.customerServiceCancelTime,
        customerServiceRemark:order.customerServiceRemark,
    
        shippingTime:order.shippingTime,
        shippingNumber:order.shippingNumber,
        shippingType:order.shippingType,
    
        finishTime:order.finishTime,
    
        items:orderItemDtoList
    }
  }

  private static orderItemToDTO(ordreItem: OrderItem): OrderItemDto {
    return {
      _id:ordreItem.id.toString(),
      name:ordreItem.name,
      price:ordreItem.price,
      image:ordreItem.image,
      commodityId:ordreItem.commodityId
    }
  }

  public static toDomain(raw: OrderDbModel): Order {
    if(raw===null || raw === undefined){
      return null
    }

    const orderAddressOrErrors=  OrderAddress.create({
      userName:raw.userName,
      provinceName : raw.provinceName,
      cityName : raw.cityName,
      countyName : raw.countyName,
      detailAddressInfo :raw.detailAddressInfo,
      nationalCode : raw.nationalCode,
      telNumber :raw.telNumber,
    })

    orderAddressOrErrors.isFailure ? console.error(orderAddressOrErrors.error) : '';


    const orderItemList=raw.items.map(item=>this.orderItemDbModelToDomain(item))

    const orderOrError = Order.create(
      {
        memberId:raw.memberId,
        createAt:raw.createAt,
        status:raw.status as OrderStatus,
        price:raw.price,
        remark:raw.remark,
        code:raw.code,
    
        orderAddress:orderAddressOrErrors.getValue(),
    
        paymentTime:raw.paymentTime,
        cancelTime:raw.cancelTime,
    
        customerServiceCancelTime:raw.customerServiceCancelTime,
        customerServiceRemark:raw.customerServiceRemark,
    
        shippingTime:raw.shippingTime,
        shippingNumber:raw.shippingNumber,
        shippingType:raw.shippingType,
    
        finishTime:raw.finishTime,
    
        items:orderItemList
      },
      new UniqueEntityID(raw._id)
    )
    orderOrError.isFailure ? console.log(orderOrError.error) : ''
    return orderOrError.isSuccess ? orderOrError.getValue() : null
  }

  private static orderItemDbModelToDomain(orderItemDbModel:OrderItemDbModel):OrderItem{
    let orderItemOrErrors=  OrderItem.create({
      name:orderItemDbModel.name,
      price:orderItemDbModel.price,
      image:orderItemDbModel.image,
      commodityId:orderItemDbModel.commodityId
    },new UniqueEntityID(orderItemDbModel._id))

    orderItemOrErrors.isSuccess?"":console.error(orderItemOrErrors.errorValue())

    return orderItemOrErrors.getValue()
  }
 

  public static async toPersistence(order: Order): Promise<OrderDbModel> {
    let orderItemDbModelList:OrderItemDbModel[]=order.orderItems.map(item=>this.toOrderItemPersistence(item))

    return {
      _id:order.id.toString(),
      memberId:order.memberId,
      createAt:order.createAt,
      status:order.status,
      price:order.price,
      remark:order.remark,
      code:order.code,

      userName:order.address.userName,
      provinceName :order.address.provinceName,
      cityName : order.address.cityName,
      countyName : order.address.countyName,
      detailAddressInfo : order.address.detailAddressInfo,
      nationalCode :order.address.nationalCode,
      telNumber :order.address.telNumber,

      paymentTime:order.paymentTime,
      cancelTime:order.cancelTime,

      customerServiceCancelTime:order.customerServiceCancelTime,
      customerServiceRemark:order.customerServiceRemark,

      shippingTime:order.shippingTime,
      shippingNumber:order.shippingNumber,
      shippingType:order.shippingType,

      finishTime:order.finishTime,

      items:orderItemDbModelList
    }
  }

  private static  toOrderItemPersistence(orderItem:OrderItem):OrderItemDbModel{
    return {
      _id:orderItem.id.toString(),
      name:orderItem.name,
      price:orderItem.price,
      image:orderItem.image,
      commodityId:orderItem.commodityId,
    }
  }
}