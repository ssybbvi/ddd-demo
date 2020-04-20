import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IThirdPartyAppDbModel } from '../dbModels/thirdPartyAppDbModel'
import { ThirdPartyApp } from '../domain/thirdPartyApp'
import { IThirdPartyAppDto, IThirdPartyAppByTokenDto } from '../dtos/thirdPartyAppDto'

export class ThirdPartyAppMap implements IMapper<ThirdPartyApp> {
  public static toDTOByGetToken(thirdPartyApp: ThirdPartyApp): IThirdPartyAppByTokenDto {
    return {
      accessToken: thirdPartyApp.accessToken,
      expiresIn: 0
    }
  }


  public static toDTO(thirdPartyApp: ThirdPartyApp): IThirdPartyAppDto {

    return {
      name: thirdPartyApp.name,
      appId: thirdPartyApp.appId,
      secret: thirdPartyApp.secret,
      createAt: thirdPartyApp.createAt,
    }
  }

  public static toDomain(raw: IThirdPartyAppDbModel): ThirdPartyApp {
    if (raw == null) {
      return null
    }
    const thirdPartyAppOrError = ThirdPartyApp.create(
      {
        name: raw.name,
        appId: raw.appId,
        secret: raw.secret,
        createAt: raw.createAt,
        accessToken: raw.accessToken,
        expiresIn: raw.expiresIn
      },
      new UniqueEntityID(raw._id)
    )

    thirdPartyAppOrError.isFailure ? console.log(thirdPartyAppOrError.error) : ''
    return thirdPartyAppOrError.isSuccess ? thirdPartyAppOrError.getValue() : null
  }

  public static toPersistence(thirdPartyApp: ThirdPartyApp): IThirdPartyAppDbModel {
    return {
      _id: thirdPartyApp.id.toString(),
      name: thirdPartyApp.name,
      appId: thirdPartyApp.appId,
      secret: thirdPartyApp.secret,
      createAt: thirdPartyApp.createAt,
      accessToken: thirdPartyApp.accessToken,
      expiresIn: thirdPartyApp.expiresIn
    }
  }
}