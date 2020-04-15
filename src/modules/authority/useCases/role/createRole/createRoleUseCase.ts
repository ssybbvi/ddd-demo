import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { CreateRoleRequestDto } from './createRoleRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { Role } from '../../../domain/role'
import { RoleName } from '../../../domain/roleName'
import { RoleDescription } from '../../../domain/roleDescription'
import { IRoleRepo } from '../../../repos/roleRepo'
import { CreateRoleErrors } from './cerateRoleErrors'
import { PermissionIds } from '../../../domain/permissionIds'

type Response = Either<CreateRoleErrors.RoleExistSameNameError | AppError.UnexpectedError, Result<void>>

export class CreateRoleUseCase implements UseCase<CreateRoleRequestDto, Promise<Response>> {
  private roleRepo: IRoleRepo

  constructor(_roleRepo: IRoleRepo) {
    this.roleRepo = _roleRepo
  }

  async execute(request?: CreateRoleRequestDto): Promise<Response> {
    const roleNameOrError = RoleName.create({ value: request.name })
    const roleDescriptionOrError = RoleDescription.create({ value: request.description })
    const rolePermissionIdsOrError = PermissionIds.create(request.permissionIds)

    const dtoResult = Result.combine([roleNameOrError, roleDescriptionOrError, rolePermissionIdsOrError])

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response
    }

    let permissionList = await this.roleRepo.findByName(request.name)
    if (permissionList && permissionList.length > 0) {
      return left(new CreateRoleErrors.RoleExistSameNameError(request.name))
    }

    const roleOrError: Result<Role> = Role.create({
      name: roleNameOrError.getValue(),
      description: roleDescriptionOrError.getValue(),
      permissionIds: rolePermissionIdsOrError.getValue()
    })

    if (roleOrError.isFailure) {
      return left(Result.fail<Role>(roleOrError.error.toString())) as Response
    }

    const role: Role = roleOrError.getValue()

    await this.roleRepo.save(role)

    return right(Result.ok<void>())
  }
}
