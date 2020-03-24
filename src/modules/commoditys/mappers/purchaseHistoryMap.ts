import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { PurchaseHistory } from '../domain/purchaseHistory'
import { PurchaseHistoryDto } from '../dtos/purchaseHistoryDto'
import { IPurchaseHistoryDbModel } from '../dbModels/purchaseHistoryDbModel'

export class PurchaseHistoryMap implements IMapper<PurchaseHistory> {
  public static toDTO(purchaseHistory: PurchaseHistory): PurchaseHistoryDto {
    return {

      nickName: purchaseHistory.nickName,
      craeteAt: purchaseHistory.craeteAt,
      avatarUrl: purchaseHistory.avatarUrl,
      gender: purchaseHistory.gender
    }
  }


  public static toDomain(raw: IPurchaseHistoryDbModel): PurchaseHistory {
    if (raw == null) {
      return null
    }

    const purchaseHistoryOrError = PurchaseHistory.create(
      {
        userId: raw.userId,
        commodityId: raw.commodityId,
        nickName: raw.nickName,
        craeteAt: raw.craeteAt,
        avatarUrl: raw.avatarUrl,
        gender: raw.gender
      },
      new UniqueEntityID(raw._id)
    )

    purchaseHistoryOrError.isFailure ? console.log(purchaseHistoryOrError.error) : ''
    return purchaseHistoryOrError.isSuccess ? purchaseHistoryOrError.getValue() : null
  }

  public static toPersistence(purchaseHistory: PurchaseHistory): IPurchaseHistoryDbModel {
    return {
      _id: purchaseHistory.id.toString(),
      userId: purchaseHistory.userId,
      commodityId: purchaseHistory.commodityId,
      nickName: purchaseHistory.nickName,
      craeteAt: purchaseHistory.craeteAt,
      avatarUrl: purchaseHistory.avatarUrl,
      gender: purchaseHistory.gender
    }
  }
}
