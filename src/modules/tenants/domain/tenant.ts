import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { TenantName, ITenantNameProps } from './tenantName'
import { TenantId } from './tenantId'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'
import { TenantMongodbConnection } from './tenantMongodbConnection'

export interface ITenantProps {
  name: TenantName
  mongodbConnection?: TenantMongodbConnection
  isActive: boolean
}

export class Tenant extends AggregateRoot<ITenantProps> {
  get tenantId(): TenantId {
    return TenantId.create(this._id).getValue()
  }

  get name(): TenantName {
    return this.props.name
  }

  get mongodbConnection(): TenantMongodbConnection {
    return this.props.mongodbConnection
  }

  get isActive(): boolean {
    return this.props.isActive
  }

  private constructor(props: ITenantProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: ITenantProps, id?: UniqueEntityID): Result<Tenant> {
    const guardResult = Guard.againstNullOrUndefinedBulk([{ argument: props.name, argumentName: 'username' }])

    if (!guardResult.succeeded) {
      return Result.fail<Tenant>(guardResult.message)
    }

    const isNewUser = !!id === false
    const user = new Tenant(
      {
        ...props,
        isActive: props.isActive ? props.isActive : true,
      },
      id
    )

    if (isNewUser) {
      //user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<Tenant>(user)
  }
}
