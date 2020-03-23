import { PermissionDiscriminator } from './permissionDiscriminator'
import { PermissionName } from './permissionName'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { PermissionId } from './permissionId'
import { Guard } from '../../../shared/core/Guard'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result, Either, left, right } from '../../../shared/core/Result'

export interface IPermissionProps {
  name: PermissionName
  discriminator: PermissionDiscriminator //
}

export type UpdatePermissionName = Either<Result<any>, Result<void>>

export class Permission extends AggregateRoot<IPermissionProps> {
  get permissionId(): PermissionId {
    return PermissionId.create(this._id).getValue()
  }

  get permissionName(): PermissionName {
    return this.props.name
  }

  get permissionDiscriminator(): PermissionDiscriminator {
    return this.props.discriminator
  }

  private constructor(props: IPermissionProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public updateName(permissionName: PermissionName): UpdatePermissionName {
    const guardResult = Guard.againstNullOrUndefined(permissionName.value, '权限名称')

    if (!guardResult.succeeded) {
      return left(Result.fail<any>(guardResult.message))
    }

    this.props.name = permissionName
    return right(Result.ok<void>())
  }

  public updateDescription(discriminator: PermissionDiscriminator): Either<Result<any>, Result<void>> {
    const guardResult = Guard.againstNullOrUndefined(discriminator.value, '权限描述')

    if (!guardResult.succeeded) {
      return left(Result.fail<any>(guardResult.message))
    }

    this.props.discriminator = discriminator
    return right(Result.ok<void>())
  }

  public static create(props: IPermissionProps, id?: UniqueEntityID): Result<Permission> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: '权限名称' },
      { argument: props.discriminator, argumentName: '权限标志' }
    ])

    if (!guardResult.succeeded) {
      return Result.fail<Permission>(guardResult.message)
    }

    return Result.ok<Permission>(new Permission(props, id))
  }
}
