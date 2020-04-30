import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ICommodityDbModel } from '../dbModels/commodityDbModel'
import { Commodity } from '../domain/commodity'
import { CommodityDto } from '../dtos/commodityDto'
import { CommodityName } from '../domain/commodityName'
import { CommodityAmount } from '../domain/commodityAmount'
import { CommodityType } from '../domain/commodityType'

export class CommodityMap implements IMapper<Commodity> {
  public static async  toListDto(commodityList: Commodity[]): Promise<CommodityDto[]> {
    let commodityDtoList = []
    for (let item of commodityList) {
      commodityDtoList.push(await this.toDTO(item))
    }
    return commodityDtoList
  }

  public static async toDTO(commodity: Commodity): Promise<CommodityDto> {
    return {
      _id: commodity.id.toString(),
      name: commodity.name.value,
      amount: commodity.amount.value,
      description: commodity.description,
      images: commodity.images,
      fakeAmount: commodity.fakeAmount,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      limitedPurchasePerPerson: commodity.limitedPurchasePerPerson,
      tags: commodity.tags,
      imgesDescrptionList: commodity.imgesDescrptionList,
      type: commodity.type
    }
  }

  public static toDomain(raw: ICommodityDbModel): Commodity {
    if (raw == null) {
      return null
    }

    const commodityNameOrErrors = CommodityName.create({ name: raw.name })
    const commdityAmountOrErrors = CommodityAmount.create({ amount: raw.amount })

    const commodityOrError = Commodity.create(
      {
        name: commodityNameOrErrors.getValue(),
        amount: commdityAmountOrErrors.getValue(),
        description: raw.description,
        images: raw.images,
        fakeAmount: raw.fakeAmount,
        sales: raw.sales,
        restrictedPurchaseQuantity: raw.restrictedPurchaseQuantity,
        limitedPurchasePerPerson: raw.limitedPurchasePerPerson,
        tags: raw.tags,
        imgesDescrptionList: raw.imgesDescrptionList,
        type: raw.type as CommodityType
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
      amount: commodity.amount.value,
      description: commodity.description,
      images: commodity.images,
      fakeAmount: commodity.fakeAmount,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      limitedPurchasePerPerson: commodity.limitedPurchasePerPerson,
      tags: commodity.tags,
      imgesDescrptionList: commodity.imgesDescrptionList,
      type: commodity.type
    }
  }
}
