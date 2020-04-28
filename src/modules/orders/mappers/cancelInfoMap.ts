import { IMapper } from '../../../shared/infra/Mapper'
import { CancelInfo } from '../domain/cancelInfo'
import { ICancelInfoDbModel } from '../dbModels/cancelInfoDbModel'
import { CancelInfoType } from '../domain/cancelInfoType'
import { ICancelInfoDto } from '../dtos/cancelInfoDto'


export class CancelInfoMap implements IMapper<CancelInfo> {
  public static toDomain(raw: ICancelInfoDbModel): CancelInfo {
    if (!raw) {
      return null
    }

    const cancelInfoOrError = CancelInfo.create(
      {
        type: raw.type as CancelInfoType,
        time: raw.time,
        remark: raw.remark
      }
    )
    cancelInfoOrError.isFailure ? console.log(cancelInfoOrError.error) : ''
    return cancelInfoOrError.isSuccess ? cancelInfoOrError.getValue() : null
  }

  public static toPersistence(cancelInfo: CancelInfo): ICancelInfoDbModel {
    if (!cancelInfo) {
      return null
    }
    return {
      type: cancelInfo.type,
      time: cancelInfo.time,
      remark: cancelInfo.remark
    }
  }

  public static toDTO(cancelInfo: CancelInfo): ICancelInfoDto {
    if (!cancelInfo) {
      return null
    }
    return {
      type: cancelInfo.type,
      time: cancelInfo.time,
      remark: cancelInfo.remark
    }
  }
}
