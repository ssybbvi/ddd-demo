import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'

export interface IPermissionNameProps {
  value: string
}

export class PermissionName extends ValueObject<IPermissionNameProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: IPermissionNameProps) {
    super(props)
  }

  public static create(props: IPermissionNameProps): Result<PermissionName> {
    const permissionnsNameResult = Guard.againstNullOrUndefined(props.value, '权限名称')
    if (!permissionnsNameResult.succeeded) {
      return Result.fail<PermissionName>(permissionnsNameResult.message)
    }

    return Result.ok<PermissionName>(new PermissionName(props))
  }
}
