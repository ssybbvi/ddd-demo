import { IMapper } from '../../../shared/infra/Mapper'
import { OrderAddress } from '../domain/orderAddress'
import { IOrderAddressDbModel } from '../dbModels/orderAddressDbModel'
import { IOrderAddressDto } from '../dtos/deliveryInfoDto'

export class OrderAddressMap implements IMapper<OrderAddress> {
  public static toDomain(raw: IOrderAddressDbModel): OrderAddress {
    if (!raw) {
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
    return orderAddressOrErrors.getValue()
  }

  public static toPersistence(orderAddress: OrderAddress): IOrderAddressDbModel {
    if (!orderAddress) {
      return null
    }
    const address: IOrderAddressDbModel = {
      userName: orderAddress.userName,
      provinceName: orderAddress.provinceName,
      cityName: orderAddress.cityName,
      countyName: orderAddress.countyName,
      detailAddressInfo: orderAddress.detailAddressInfo,
      nationalCode: orderAddress.nationalCode,
      telNumber: orderAddress.telNumber,
    }

    return address
  }

  public static toDTO(orderAddress: OrderAddress): IOrderAddressDto {
    if (!orderAddress) {
      return null
    }
    const address = {
      userName: orderAddress.userName,
      provinceName: orderAddress.provinceName,
      cityName: orderAddress.cityName,
      countyName: orderAddress.countyName,
      detailAddressInfo: orderAddress.detailAddressInfo,
      nationalCode: orderAddress.nationalCode,
      telNumber: orderAddress.telNumber,
    }

    return address
  }
}
