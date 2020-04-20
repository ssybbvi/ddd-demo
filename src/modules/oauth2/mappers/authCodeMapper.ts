import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { AuthCode } from '../domain/authCode'
import { IAuthCodeDbModel } from '../dbModels/authCodeDbModel'
import { IAuthCodeDto } from '../dtos/authCodeDto'

export class AuthCodeMap implements IMapper<AuthCode> {
  public static toDTO(authCode: AuthCode): IAuthCodeDto {
    return {
      code: authCode.code,
      expiresIn: authCode.expiresIn,
    }
  }

  public static toDomain(raw: IAuthCodeDbModel): AuthCode {
    if (raw == null) {
      return null
    }
    const authCodeOrError = AuthCode.create(
      {
        appId: raw.appId,
        code: raw.code,
        userId: raw.userId,
        createAt: raw.createAt,
        expiresIn: raw.expiresIn,
      },
      new UniqueEntityID(raw._id)
    )

    authCodeOrError.isFailure ? console.log(authCodeOrError.error) : ''
    return authCodeOrError.isSuccess ? authCodeOrError.getValue() : null
  }

  public static toPersistence(authCode: AuthCode): IAuthCodeDbModel {
    return {
      _id: authCode.id.toString(),
      appId: authCode.appId,
      code: authCode.code,
      userId: authCode.userId,
      createAt: authCode.createAt,
      expiresIn: authCode.expiresIn,
    }
  }
}
