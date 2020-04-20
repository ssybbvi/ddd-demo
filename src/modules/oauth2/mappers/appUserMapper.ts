import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { AppUser } from '../domain/appUser'
import { IAppUserDbModel } from '../dbModels/appUserDbModel'
import { IAppUserDto } from '../dtos/appUserDto'

export class AppUserMap implements IMapper<AppUser> {
  public static toDTO(appUser: AppUser): IAppUserDto {
    return {
      openUserId: appUser.openUserId,
    }
  }

  public static toDomain(raw: IAppUserDbModel): AppUser {
    if (raw == null) {
      return null
    }
    const appUserOrError = AppUser.create(
      {
        appId: raw.appId,
        userId: raw.userId,
        openUserId: raw.openUserId,
        createAt: raw.createAt,
      },
      new UniqueEntityID(raw._id)
    )

    appUserOrError.isFailure ? console.log(appUserOrError.error) : ''
    return appUserOrError.isSuccess ? appUserOrError.getValue() : null
  }

  public static toPersistence(appUser: AppUser): IAppUserDbModel {
    return {
      _id: appUser.id.toString(),
      appId: appUser.appId,
      userId: appUser.userId,
      openUserId: appUser.openUserId,
      createAt: appUser.createAt,
    }
  }
}
