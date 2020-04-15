import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { DeletePermissionRequestDto } from './deletePermissionRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { Permission } from '../../../domain/permission'
import { PermissionName } from '../../../domain/permissionName'
import { PermissionDiscriminator } from '../../../domain/permissionDiscriminator'
import { IPermissionRepo } from '../../../repos/permissionRepo'
import { DeletePermissionErrors } from './deletePermissionErrors'
import { Guard } from '../../../../../shared/core/Guard'

type Response = Either<
  DeletePermissionErrors.PermissionIdIsNullError | AppError.UnexpectedError,
  Result<void>
>

export class DeletePermissionUseCase implements UseCase<DeletePermissionRequestDto, Promise<Response>> {
  private permissionRepo: IPermissionRepo

  constructor(_permissionRepo: IPermissionRepo) {
    this.permissionRepo = _permissionRepo
  }

  async execute(request?: DeletePermissionRequestDto): Promise<Response> {
    let guardResult = Guard.againstNullOrUndefined(request._id, '删除标示')
    if (!guardResult.succeeded) {
      return left(new DeletePermissionErrors.PermissionIdIsNullError(guardResult.message))
    }

    await this.permissionRepo.deleteById(request._id)

    return right(Result.ok<void>())
  }
}
