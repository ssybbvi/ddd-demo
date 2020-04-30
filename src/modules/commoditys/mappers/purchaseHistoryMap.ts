import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { PurchaseHistory } from '../domain/purchaseHistory'
import { PurchaseHistoryDto } from '../dtos/purchaseHistoryDto'
import { IPurchaseHistoryDbModel } from '../dbModels/purchaseHistoryDbModel'
import { userIdToDto } from '../../users/infra/decorators/wxUserDtoDecorators'

export class PurchaseHistoryMap implements IMapper<PurchaseHistory> {

  public static async toDtoList(purchaseHistoryList: PurchaseHistory[]) {
    const list = []
    for (let item of purchaseHistoryList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  @userIdToDto()
  public static async toDTO(purchaseHistory: PurchaseHistory): Promise<PurchaseHistoryDto> {
    return {
      userId: purchaseHistory.userId,
      craeteAt: purchaseHistory.craeteAt
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
        craeteAt: raw.craeteAt,
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
      craeteAt: purchaseHistory.craeteAt,
    }
  }
}
