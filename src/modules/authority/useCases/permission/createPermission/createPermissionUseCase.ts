import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { CreatePermissionRequestDto } from './createPermissionRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { Permission } from '../../../domain/permission'
import { PermissionName } from '../../../domain/permissionName'
import { PermissionDiscriminator } from '../../../domain/permissionDiscriminator'
import { IPermissionRepo } from '../../../repos/permissionRepo'
import { CreatePermissionErrors } from './createPermissionError'

type Response = Either<
  CreatePermissionErrors.PermissionExistSameNameError | Result<any> | AppError.UnexpectedError,
  Result<void>
>

export class CreatePermissionUseCase implements UseCase<CreatePermissionRequestDto, Promise<Response>> {
  private permissionRepo: IPermissionRepo

  constructor(_permissionRepo: IPermissionRepo) {
    this.permissionRepo = _permissionRepo
  }

  async execute(request?: CreatePermissionRequestDto): Promise<Response> {
    const permissionNameOrError = PermissionName.create({ value: request.name })
    const permissionDiscriminatorOrError = PermissionDiscriminator.create({ value: request.discriminator })

    const dtoResult = Result.combine([permissionNameOrError, permissionDiscriminatorOrError])

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response
    }

    let permissionList = await this.permissionRepo.findByName(request.name)
    if (permissionList && permissionList.length > 0) {
      return left(new CreatePermissionErrors.PermissionExistSameNameError(request.name))
    }

    const permissionOrError: Result<Permission> = Permission.create({
      name: permissionNameOrError.getValue(),
      discriminator: permissionDiscriminatorOrError.getValue(),
    })

    if (permissionOrError.isFailure) {
      return left(Result.fail<Permission>(permissionOrError.error.toString())) as Response
    }

    const permission: Permission = permissionOrError.getValue()
    await this.permissionRepo.save(permission)

    return right(Result.ok<void>())
  }
}
