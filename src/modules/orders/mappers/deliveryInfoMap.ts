import { IMapper } from '../../../shared/infra/Mapper'
import { DeliveryInfo } from '../domain/deliveryInfo'
import { IDeliveryInfoDto } from '../dtos/deliveryInfoDto'
import { DeliveryInfoType } from '../domain/deliveryInfoType'
import { IDeliveryInfoDbModel } from '../dbModels/deliveryInfoDbModel'
import { AddressInfoMap } from './addressInfoMap'

export class DeliveryInfoMap implements IMapper<DeliveryInfo> {
  public static toDomain(raw: IDeliveryInfoDbModel): DeliveryInfo {
    if (!raw) {
      return null
    }

    const deliveryInfoOrError = DeliveryInfo.create({
      beginAt: raw.beginAt,
      code: raw.code,
      finishAt: raw.finishAt,
      type: raw.type as DeliveryInfoType,
    })
    deliveryInfoOrError.isFailure ? console.log(deliveryInfoOrError.error) : ''
    return deliveryInfoOrError.isSuccess ? deliveryInfoOrError.getValue() : null
  }

  public static toPersistence(deliveryInfo: DeliveryInfo): IDeliveryInfoDbModel {
    if (!deliveryInfo) {
      return null
    }
    return {
      beginAt: deliveryInfo.beginAt,
      code: deliveryInfo.code,
      finishAt: deliveryInfo.finishAt,
      type: deliveryInfo.type,
    }
  }

  public static toDTO(deliveryInfo: DeliveryInfo): IDeliveryInfoDto {
    if (!deliveryInfo) {
      return null
    }
    return {
      beginAt: deliveryInfo.beginAt,
      code: deliveryInfo.code,
      finishAt: deliveryInfo.finishAt,
      type: deliveryInfo.type,
    }
  }
}
