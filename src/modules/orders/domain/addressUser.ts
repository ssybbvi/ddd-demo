import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result, Either, left, right } from '../../../shared/core/Result'

import { AddressInfo } from './addressInfo'

export interface AddressUserProps {
  userId: string
  isDefault: boolean
  addressInfo: AddressInfo
}

export class AddressUser extends AggregateRoot<AddressUserProps> {
  private constructor(props: AddressUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get userId(): string {
    return this.props.userId
  }

  get isDefault(): boolean {
    return this.props.isDefault
  }

  get addressInfo(): AddressInfo {
    return this.props.addressInfo
  }

  public updateAddressInfo(addressInfo: AddressInfo) {
    this.props.addressInfo = addressInfo
  }

  public static create(props: AddressUserProps, id?: UniqueEntityID): Result<AddressUser> {
    const isNew = !!id === false
    const order = new AddressUser(
      {
        ...props,
      },
      id
    )

    if (isNew) {
    }

    return Result.ok<AddressUser>(order)
  }
}
