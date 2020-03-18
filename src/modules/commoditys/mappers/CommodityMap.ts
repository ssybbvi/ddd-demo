import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ICommodityDbModel } from '../dbModels/commodityDbModel'
import { Commodity } from '../domain/commodity'
import { CommodityDto } from '../dtos/commodityDto'

export class CommodityMap implements IMapper<Commodity> {
  public static toDTO(commodity: Commodity): CommodityDto {
    return {
      _id:commodity.id.toString(),
      name: commodity.name,
      price: commodity.price,
      descrption: commodity.descrption,
      images: commodity.images,
      fakePrice: commodity.fakePrice,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      tags: commodity.tags
    }
  }

  public static toDomain(raw: ICommodityDbModel): Commodity {
    if(raw==null){
      return null
    }
    const commodityOrError = Commodity.create(
      {
        name: raw.name,
        price: raw.price,
        descrption: raw.descrption,
        images: raw.images,
        fakePrice: raw.fakePrice,
        sales: raw.sales,
        restrictedPurchaseQuantity: raw.restrictedPurchaseQuantity,
        tags: raw.tags
      },
      new UniqueEntityID(raw._id)
    )

    commodityOrError.isFailure ? console.log(commodityOrError.error) : ''
    return commodityOrError.isSuccess ? commodityOrError.getValue() : null
  }

  public static toPersistence(commodity: Commodity): ICommodityDbModel {
    return {
      _id: commodity.id.toString(),
      name: commodity.name,
      price: commodity.price,
      descrption: commodity.descrption,
      images: commodity.images,
      fakePrice: commodity.fakePrice,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      tags: commodity.tags
    }
  }
}
