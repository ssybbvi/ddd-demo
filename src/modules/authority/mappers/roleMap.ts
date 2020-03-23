import { IMapper } from '../../../shared/infra/Mapper'
import { Role } from '../domain/role'
import { RoleDTO } from '../dtos/roleDto'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IRoleDbModel } from '../dbModels/iRoleDbModel'
import { RoleName } from '../domain/roleName'
import { RoleDescription } from '../domain/roleDescription'
import { PermissionIds } from '../domain/permissionIds'

export class RoleMap implements IMapper<Role> {
  public static toDomain(raw: IRoleDbModel): Role {
    const nameOrError = RoleName.create({ value: raw.name })
    const descriptionOrError = RoleDescription.create({ value: raw.description })
    const permissionIdsOrError = PermissionIds.create(raw.permissionIds)

    const roleOrError = Role.create(
      {
        name: nameOrError.getValue(),
        description: descriptionOrError.getValue(),
        permissionIds: permissionIdsOrError.getValue()
      },
      new UniqueEntityID(raw._id)
    )

    roleOrError.isFailure ? console.log(roleOrError.error) : ''

    return roleOrError.isSuccess ? roleOrError.getValue() : null
  }

  public static toPersistence(role: Role): IRoleDbModel {
    return {
      _id: role.roleId.id.toString(),
      name: role.roleName.value,
      description: role.roleDescription.value,
      permissionIds: role.permissionIds.getItems()
    }
  }

  public static toDto(role: Role): RoleDTO {
    return {
      _id: role.roleId.id.toString(),
      name: role.roleName.value,
      description: role.roleDescription.value,
      permissionIds: role.permissionIds.getItems()
    }
  }
}
