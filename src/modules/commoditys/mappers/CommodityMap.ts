import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ICommodityDbModel } from '../dbModels/commodityDbModel'
import { Commodity } from '../domain/commodity'
import { CommodityDto } from '../dtos/commodityDto'
import { CommodityName } from '../domain/commodityName'
import { CommodityPrice } from '../domain/commodityPrice'

export class CommodityMap implements IMapper<Commodity> {
  public static toDTO(commodity: Commodity): CommodityDto {
    return {
      _id:commodity.id.toString(),
      name: commodity.name.value,
      price: commodity.price.value,
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

    const commodityNameOrErrors= CommodityName.create({ name:raw.name })
    const commdityPriceOrErrors=CommodityPrice.create({ price:raw.price })
 
    const commodityOrError = Commodity.create(
      {
        name: commodityNameOrErrors.getValue(),
        price: commdityPriceOrErrors.getValue(),
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
      name: commodity.name.value,
      price: commodity.price.value,
      descrption: commodity.descrption,
      images: commodity.images,
      fakePrice: commodity.fakePrice,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      tags: commodity.tags
    }
  }
}
