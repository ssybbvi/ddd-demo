import { IAddressInfoDto } from './deliveryInfoDto'

export interface IAddressUserDto {
  _id: string
  userId: string
  isDefault: boolean
  addressInfo: IAddressInfoDto
}
