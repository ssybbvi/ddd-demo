import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { UpdateRoleRequestDto } from './updateRoleRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { RoleName } from '../../../domain/roleName'
import { RoleDescription } from '../../../domain/roleDescription'
import { IRoleRepo } from '../../../repos/roleRepo'
import { UpdateRoleErrors } from './updateRoleErrors'
import { PermissionIds } from '../../../domain/permissionIds'

type Response = Either<UpdateRoleErrors.RoleExistSameNameError | AppError.UnexpectedError, Result<void>>

export class UpdateRoleUseCase implements UseCase<UpdateRoleRequestDto, Promise<Response>> {
  private roleRepo: IRoleRepo

  constructor(_roleRepo: IRoleRepo) {
    this.roleRepo = _roleRepo
  }

  async execute(request?: UpdateRoleRequestDto): Promise<Response> {
    const roleNameOrError = RoleName.create({ value: request.name })
    const roleDescriptionOrError = RoleDescription.create({ value: request.description })
    const rolePermissionIdsOrError = PermissionIds.create(request.permissionIds)

    const dtoResult = Result.combine([roleNameOrError, roleDescriptionOrError, rolePermissionIdsOrError])

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response
    }

    // let roleList = await this.roleRepo.findByName(request.name)
    // if (roleList.some(item => item.roleId.id.toString() !== request._id)) {
    //   return left(new UpdateRoleErrors.RoleExistSameNameError(request.name))
    // }

    let role = await this.roleRepo.getById(request._id)
    role.updateName(roleNameOrError.getValue())
    role.updateDescription(roleDescriptionOrError.getValue())
    role.updatePermissionIds(rolePermissionIdsOrError.getValue())

    await this.roleRepo.save(role)

    return right(Result.ok<void>())
  }
}
