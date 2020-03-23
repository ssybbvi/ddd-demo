import { IMapper } from '../../../shared/infra/Mapper'
import { Permission } from '../domain/permission'
import { PermissionDTO } from '../dtos/permissionDTO'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IPermissionDbModel } from '../dbModels/iPermissionDbModel'
import { PermissionName } from '../domain/permissionName'
import { PermissionDiscriminator } from '../domain/permissionDiscriminator'

export class PermissionMap implements IMapper<Permission> {
  public static toDomain(raw: IPermissionDbModel): Permission {
    const nameOrError = PermissionName.create({ value: raw.name })
    const discriminatorOrError = PermissionDiscriminator.create({ value: raw.discriminator })

    const permissionOrError = Permission.create(
      {
        name: nameOrError.getValue(),
        discriminator: discriminatorOrError.getValue()
      },
      new UniqueEntityID(raw._id)
    )

    permissionOrError.isFailure ? console.log(permissionOrError.error) : ''

    return permissionOrError.isSuccess ? permissionOrError.getValue() : null
  }

  public static toPersistence(permission: Permission): IPermissionDbModel {
    return {
      _id: permission.permissionId.id.toString(),
      name: permission.permissionName.value,
      discriminator: permission.permissionDiscriminator.value
    }
  }

  public static toDto(permission: Permission): PermissionDTO {
    return {
      _id: permission.permissionId.id.toString(),
      name: permission.permissionName.value,
      discriminator: permission.permissionDiscriminator.value
    }
  }
}
