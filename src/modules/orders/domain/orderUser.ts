import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'

interface OrderUserProps {
  isAllowBuyOnceCommodity: boolean
}

export class OrderUser extends AggregateRoot<OrderUserProps> {
  private constructor(props: OrderUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get isAllowBuyOnceCommodity(): boolean {
    return this.props.isAllowBuyOnceCommodity
  }

  public buyOnceCommodity() {
    this.props.isAllowBuyOnceCommodity = false
  }

  public static create(
    props: OrderUserProps,
    id?: UniqueEntityID,
    isAddDomainEvent: boolean = false
  ): Result<OrderUser> {
    const defaultValues: OrderUserProps = {
      ...props,
    }

    const orderUser = new OrderUser(defaultValues, id)
    const isNewOrderUser = !!id === false

    if (isNewOrderUser || isAddDomainEvent) {
    }

    return Result.ok<OrderUser>(orderUser)
  }
}
