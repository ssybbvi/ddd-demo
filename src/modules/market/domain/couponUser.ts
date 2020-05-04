import { AggregateRoot } from '../../../shared/domain/AggregateRoot'

export interface ICouponUserProps {
  userId: string
  receiveAt: number
  useAt: number
}

export class CouponUser extends AggregateRoot<ICouponUserProps> {}
