import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { UpdatePermissionRequestDto } from './updatePermissionRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { Permission } from '../../../domain/permission'
import { PermissionName } from '../../../domain/permissionName'
import { PermissionDiscriminator } from '../../../domain/permissionDiscriminator'
import { IPermissionRepo } from '../../../repos/permissionRepo'
import { UpdatePermissionErrors } from './updatePermissionError'

type Response = Either<
  UpdatePermissionErrors.PermissionExistSameNameError | AppError.UnexpectedError | Result<any>,
  Result<void>
>

export class UpdatePermissionUseCase implements UseCase<UpdatePermissionRequestDto, Promise<Response>> {
  private permissionRepo: IPermissionRepo

  constructor(_permissionRepo: IPermissionRepo) {
    this.permissionRepo = _permissionRepo
  }

  async execute(request?: UpdatePermissionRequestDto): Promise<Response> {
    const permissionNameOrError = PermissionName.create({ value: request.name })
    const permissionDiscriminatorOrError = PermissionDiscriminator.create({ value: request.discriminator })

    const dtoResult = Result.combine([permissionNameOrError, permissionDiscriminatorOrError])

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response
    }

    let permissionList = await this.permissionRepo.findByName(request.name)
    if (permissionList.some(item => item.permissionId.id.toString() !== request._id)) {
      return left(new UpdatePermissionErrors.PermissionExistSameNameError(request.name))
    }

    let permission = await this.permissionRepo.getById(request._id)
    permission.updateName(permissionNameOrError.getValue())
    permission.updateDescription(permissionDiscriminatorOrError.getValue())
    this.permissionRepo.save(permission)
    return right(Result.ok<void>())
  }
}
