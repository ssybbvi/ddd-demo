import { IMapper } from '../../../shared/infra/Mapper'
import { AddressInfo } from '../domain/addressInfo'
import { IAddressInfoDbModel } from '../dbModels/AddressInfoDbModel'
import { IAddressInfoDto } from '../dtos/deliveryInfoDto'

export class AddressInfoMap implements IMapper<AddressInfo> {
  public static toDomain(raw: IAddressInfoDbModel): AddressInfo {
    if (!raw) {
      return null
    }

    const addressInfoOrErrors = AddressInfo.create({
      userName: raw.userName,
      provinceName: raw.provinceName,
      cityName: raw.cityName,
      countyName: raw.countyName,
      detailAddressInfo: raw.detailAddressInfo,
      nationalCode: raw.nationalCode,
      telNumber: raw.telNumber,
    })

    addressInfoOrErrors.isFailure ? console.log(addressInfoOrErrors.error) : null
    return addressInfoOrErrors.getValue()
  }

  public static toPersistence(addressInfo: AddressInfo): IAddressInfoDbModel {
    if (!addressInfo) {
      return null
    }
    const address: IAddressInfoDbModel = {
      userName: addressInfo.userName,
      provinceName: addressInfo.provinceName,
      cityName: addressInfo.cityName,
      countyName: addressInfo.countyName,
      detailAddressInfo: addressInfo.detailAddressInfo,
      nationalCode: addressInfo.nationalCode,
      telNumber: addressInfo.telNumber,
    }

    return address
  }

  public static toDTO(addressInfo: AddressInfo): IAddressInfoDto {
    if (!addressInfo) {
      return null
    }
    const address = {
      userName: addressInfo.userName,
      provinceName: addressInfo.provinceName,
      cityName: addressInfo.cityName,
      countyName: addressInfo.countyName,
      detailAddressInfo: addressInfo.detailAddressInfo,
      nationalCode: addressInfo.nationalCode,
      telNumber: addressInfo.telNumber,
    }

    return address
  }
}
