import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { DeliveryOrder } from '../domain/deliveryOrder'
import { IDeliveryOrderDto } from '../dtos/deliveryOrderDto'
import { OrderAddress } from '../domain/orderAddress'
import { IDeliveryOrderDbModel } from '../dbModels/deliveryOrderDbModel'

export class DeliveryOrderMap implements IMapper<DeliveryOrder> {
  public static toDomain(raw: IDeliveryOrderDbModel): DeliveryOrder {
    if (raw === null) {
      return null
    }

    const orderAddressOrErrors = OrderAddress.create({
      userName: raw.userName,
      provinceName: raw.provinceName,
      cityName: raw.cityName,
      countyName: raw.countyName,
      detailAddressInfo: raw.detailAddressInfo,
      nationalCode: raw.nationalCode,
      telNumber: raw.telNumber,
    })

    orderAddressOrErrors.isFailure ? console.log(orderAddressOrErrors.error) : null

    const deliveryOrderOrError = DeliveryOrder.create(
      {
        orderId: raw.orderId,
        address: orderAddressOrErrors.getValue(),
        beginAt: raw.beginAt,
        code: raw.code,
        finishAt: raw.finishAt,
        deliveryType: raw.deliveryType,
      },
      new UniqueEntityID(raw._id)
    )
    deliveryOrderOrError.isFailure ? console.log(deliveryOrderOrError.error) : ''
    return deliveryOrderOrError.isSuccess ? deliveryOrderOrError.getValue() : null
  }

  public static toPersistence(deliveryOrder: DeliveryOrder): IDeliveryOrderDbModel {
    return {
      _id: deliveryOrder.deliveryOrderId.toString(),
      orderId: deliveryOrder.orderId,
      beginAt: deliveryOrder.beginAt,
      code: deliveryOrder.code,
      finishAt: deliveryOrder.finishAt,
      deliveryType: deliveryOrder.deliveryType,

      userName: deliveryOrder.address.userName,
      provinceName: deliveryOrder.address.provinceName,
      cityName: deliveryOrder.address.cityName,
      countyName: deliveryOrder.address.countyName,
      detailAddressInfo: deliveryOrder.address.detailAddressInfo,
      nationalCode: deliveryOrder.address.nationalCode,
      telNumber: deliveryOrder.address.telNumber,

    }
  }

  public static toDTO(deliveryOrder: DeliveryOrder): IDeliveryOrderDto {
    return {
      _id: deliveryOrder.deliveryOrderId.toString(),
      orderId: deliveryOrder.orderId,
      beginAt: deliveryOrder.beginAt,
      code: deliveryOrder.code,
      finishAt: deliveryOrder.finishAt,
      deliveryType: deliveryOrder.deliveryType,

      userName: deliveryOrder.address.userName,
      provinceName: deliveryOrder.address.provinceName,
      cityName: deliveryOrder.address.cityName,
      countyName: deliveryOrder.address.countyName,
      detailAddressInfo: deliveryOrder.address.detailAddressInfo,
      nationalCode: deliveryOrder.address.nationalCode,
      telNumber: deliveryOrder.address.telNumber,
    }
  }
}
