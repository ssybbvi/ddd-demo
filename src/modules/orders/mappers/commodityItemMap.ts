import { IMapper } from '../../../shared/infra/Mapper'
import { CommodityItem } from '../domain/commodityItem'
import { ICommodityItemDbModel } from '../dbModels/commodityItemDbModel'
import { CommodityType } from '../../commoditys/domain/commodityType'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ICommodityItemDto } from '../dtos/commodityItemDto'


export class CommodityItemMap implements IMapper<CommodityItem> {
  public static toDomain(raw: ICommodityItemDbModel): CommodityItem {
    if (!raw) {
      return null
    }

    const commodityItemOrError = CommodityItem.create(
      {
        name: raw.name,
        price: raw.price,
        image: raw.image,
        commodityId: raw.commodityType,
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
      price: commodityItem.price,
      image: commodityItem.image,
      commodityId: commodityItem.commodityType,
      commodityType: commodityItem.commodityType
    }
  }

  public static toDTO(commodityItem: CommodityItem): ICommodityItemDto {
    if (!commodityItem) {
      return null
    }
    return {
      _id: commodityItem.id.toString(),
      name: commodityItem.name,
      price: commodityItem.price,
      image: commodityItem.image,
      commodityId: commodityItem.commodityType,
      commodityType: commodityItem.commodityType
    }
  }
}
