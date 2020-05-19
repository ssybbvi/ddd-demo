import { IMapper } from '../../../shared/infra/Mapper'
import { AddressUser } from '../domain/addressUser'
import { IAddressUserDbModel } from '../dbModels/addressUresDbModel'
import { AddressInfoMap } from './addressInfoMap'
import { IAddressUserDto } from '../dtos/addressUserDto'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'

export class AddressUserMap implements IMapper<AddressUser> {
  public static toDomain(raw: IAddressUserDbModel): AddressUser {
    if (!raw) {
      return null
    }

    const addressUserOrErrors = AddressUser.create(
      {
        userId: raw.userId,
        isDefault: raw.isDefault,
        addressInfo: AddressInfoMap.toDomain(raw.addressInfo),
      },
      new UniqueEntityID(raw._id)
    )

    addressUserOrErrors.isFailure ? console.log(addressUserOrErrors.error) : null
    return addressUserOrErrors.getValue()
  }

  public static toPersistence(addressUser: AddressUser): IAddressUserDbModel {
    if (!addressUser) {
      return null
    }
    const address: IAddressUserDbModel = {
      _id: addressUser.id.toString(),
      userId: addressUser.userId,
      isDefault: addressUser.isDefault,
      addressInfo: AddressInfoMap.toPersistence(addressUser.addressInfo),
    }

    return address
  }

  public static toDtoList(addressUserList: AddressUser[]): IAddressUserDto[] {
    let dtoList = []
    for (let item of addressUserList) {
      dtoList.push(this.toDTO(item))
    }
    return dtoList
  }

  public static toDTO(addressUser: AddressUser): IAddressUserDto {
    if (!addressUser) {
      return null
    }
    return {
      _id: addressUser.id.toString(),
      userId: addressUser.userId,
      isDefault: addressUser.isDefault,
      addressInfo: AddressInfoMap.toDTO(addressUser.addressInfo),
    }
  }
}
