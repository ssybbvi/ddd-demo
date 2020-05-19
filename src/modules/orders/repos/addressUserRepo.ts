import { AddressUser } from '../domain/addressUser'

export interface IAddressUserRepo {
  save(addressUser: AddressUser): Promise<void>
  getById(_id: string): Promise<AddressUser>
  exist(_id: string): Promise<boolean>
  filter(userId: string): Promise<AddressUser[]>
}
