import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { CommodityTag } from '../domain/commodityTag'

import { ICommodityTagDbModel } from '../dbModels/commodityTagDbModel'
import { CommodityTagDto } from '../dtos/commodityTagDto'

export class CommodityTagMap implements IMapper<CommodityTag> {
  public static toDTO(commodityTag: CommodityTag): CommodityTagDto {
    return {
      _id: commodityTag.id.toString(),
      name: commodityTag.name,
      description: commodityTag.description,
      tag: commodityTag.tag,
    }
  }


  public static toDomain(raw: ICommodityTagDbModel): CommodityTag {
    if (raw == null) {
      return null
    }

    const commodityTagOrError = CommodityTag.create(
      {
        name: raw.name,
        description: raw.description,
        tag: raw.tag,
      },
      new UniqueEntityID(raw._id)
    )

    commodityTagOrError.isFailure ? console.log(commodityTagOrError.error) : ''
    return commodityTagOrError.isSuccess ? commodityTagOrError.getValue() : null
  }

  public static toPersistence(commodityTag: CommodityTag): ICommodityTagDbModel {
    return {
      _id: commodityTag.id.toString(),
      name: commodityTag.name,
      description: commodityTag.description,
      tag: commodityTag.tag,
    }
  }
}
