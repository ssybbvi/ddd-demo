import { IMapper } from '../../../shared/infra/Mapper'
import { CommodityItem } from '../domain/commodityItem'
import { ICommodityItemDbModel } from '../dbModels/commodityItemDbModel'
import { CommodityType } from '../../commoditys/domain/commodityType'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ICommodityItemDto } from '../dtos/commodityItemDto'
import { commodityIdToDto } from '../../commoditys/infra/decorators/commodityIdToDto'


export class CommodityItemMap implements IMapper<CommodityItem> {
  public static toDomain(raw: ICommodityItemDbModel): CommodityItem {
    if (!raw) {
      return null
    }

    const commodityItemOrError = CommodityItem.create(
      {
        name: raw.name,
        amount: raw.amount,
        commodityId: raw.commodityId,
        commodityType: raw.commodityType as CommodityType
      }, new UniqueEntityID(raw._id)
    )
    commodityItemOrError.isFailure ? console.log(commodityItemOrError.error) : ''
    return commodityItemOrError.isSuccess ? commodityItemOrError.getValue() : null
  }

  public static toPersistence(commodityItem: CommodityItem): ICommodityItemDbModel {
    if (!commodityItem) {
      return null
    }
    return {
      _id: commodityItem.id.toString(),
      name: commodityItem.name,
      amount: commodityItem.amount,
      commodityId: commodityItem.commodityId,
      commodityType: commodityItem.commodityType
    }
  }

  public static async toListDto(commodityItemList: CommodityItem[]) {
    const commodityItemDtoList = []
    for (let item of commodityItemList) {
      commodityItemDtoList.push(await this.toDTO(item))
    }
    return commodityItemDtoList
  }

  @commodityIdToDto()
  public static async toDTO(commodityItem: CommodityItem): Promise<ICommodityItemDto> {
    if (!commodityItem) {
      return null
    }
    return {
      _id: commodityItem.id.toString(),
      name: commodityItem.name,
      amount: commodityItem.amount,
      commodityId: commodityItem.commodityId,
      commodityType: commodityItem.commodityType
    }
  }
}
