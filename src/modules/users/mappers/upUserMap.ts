import { IMapper } from '../../../shared/infra/Mapper'
import { UpUser } from '../domain/upUser'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IUpUserDbModels } from '../dbModels/iUpUserDbModels'
import { UpUserDto } from '../dtos/upUserDto'
import { UpUserName } from '../domain/upUserName'
import { UpUserPassword } from '../domain/upUserPassword'

export class UpUserMap implements IMapper<UpUser> {
  public static toDTO(user: UpUser): UpUserDto {
    return {
      username: user.userName.value
    }
  }

  public static toDomain(raw: IUpUserDbModels): UpUser {
    if (raw === null) {
      return null
    }
    const upUserNameOrError = UpUserName.create({ name: raw.userName })
    const upPasswordError = UpUserPassword.create({ value: raw.userName })

    const userOrError = UpUser.create(
      {
        userName: upUserNameOrError.getValue(),
        password: upPasswordError.getValue(),
        salt: raw.salt
      },
      new UniqueEntityID(raw._id)
    )

    userOrError.isFailure ? console.log(userOrError.error) : ''

    return userOrError.isSuccess ? userOrError.getValue() : null
  }

  public static async toPersistence(user: UpUser): Promise<IUpUserDbModels> {
    return {
      _id: user.id.toString(),
      userName: user.userName.value,
      password: user.password.value,
      salt: user.salt
    }
  }

  public static toAdminDto(user: UpUser) {
    return {
      id: user.id.toString(),
      avatar: 'test-avatar',
      email: 'xxxxx',
      name: 'xxxx',
      title: 'test-title',
      group: 'test-group',
      signature: 'test-signature',
      tags: [
        {
          key: 'test-key',
          label: 'test-label',
        },
      ],
      userid: '11',
      unreadCount: 123,
      notifyCount: 123,
    }
  }
}
