import { ValueObject } from '../../../shared/domain/ValueObject'
import { Result } from '../../../shared/core/Result'
import { Guard } from '../../../shared/core/Guard'

export interface IPermissionDiscriminatorProps {
  value: string
}

export class PermissionDiscriminator extends ValueObject<IPermissionDiscriminatorProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: IPermissionDiscriminatorProps) {
    super(props)
  }

  public static create(props: IPermissionDiscriminatorProps): Result<PermissionDiscriminator> {
    const permissionnsDiscrimiatorResult = Guard.againstNullOrUndefined(props.value, '权限名称')
    if (!permissionnsDiscrimiatorResult.succeeded) {
      return Result.fail<PermissionDiscriminator>(permissionnsDiscrimiatorResult.message)
    }

    return Result.ok<PermissionDiscriminator>(new PermissionDiscriminator(props))
  }
}
