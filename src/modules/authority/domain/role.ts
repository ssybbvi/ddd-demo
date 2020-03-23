import { Guard } from '../../../shared/core/Guard'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { RoleName } from './roleName'
import { RoleDescription } from './roleDescription'
import { RoleId } from './roleId'
import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result, Either, left, right } from '../../../shared/core/Result'
import { PermissionIds } from './permissionIds'

export interface IRoleProps {
  name: RoleName
  description: RoleDescription
  permissionIds?: PermissionIds
}

export class Role extends AggregateRoot<IRoleProps> {
  get roleId(): RoleId {
    return RoleId.create(this._id).getValue()
  }

  get roleName(): RoleName {
    return this.props.name
  }

  get roleDescription(): RoleDescription {
    return this.props.description
  }

  get permissionIds(): PermissionIds {
    return this.props.permissionIds
  }

  private constructor(props: IRoleProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public updateName(roleName: RoleName): Either<Result<any>, Result<void>> {
    const guardResult = Guard.againstNullOrUndefined(roleName.value, '角色名称')

    if (!guardResult.succeeded) {
      return left(Result.fail<any>(guardResult.message))
    }

    this.props.name = roleName
    return right(Result.ok<void>())
  }

  public updateDescription(description: RoleDescription): Either<Result<any>, Result<void>> {
    const guardResult = Guard.againstNullOrUndefined(description.value, '角色描述')

    if (!guardResult.succeeded) {
      return left(Result.fail<any>(guardResult.message))
    }

    this.props.description = description
    return right(Result.ok<void>())
  }

  public updatePermissionIds(permissionIds: PermissionIds): Either<Result<any>, Result<void>> {
    const guardResult = Guard.againstNullOrUndefined(permissionIds.getItems(), '角色描述')

    if (!guardResult.succeeded) {
      return left(Result.fail<any>(guardResult.message))
    }

    this.props.permissionIds = permissionIds
    return right(Result.ok<void>())
  }

  public static create(props: IRoleProps, id?: UniqueEntityID): Result<Role> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: '角色名称' },
      { argument: props.description, argumentName: '角色描述' }
    ])

    if (!guardResult.succeeded) {
      return Result.fail<Role>(guardResult.message)
    }

    return Result.ok<Role>(new Role(props, id))
  }
}
