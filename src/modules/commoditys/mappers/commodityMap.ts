import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { ICommodityDbModel } from '../dbModels/commodityDbModel'
import { Commodity } from '../domain/commodity'
import { CommodityDto } from '../dtos/commodityDto'
import { CommodityName } from '../domain/commodityName'
import { CommodityType } from '../domain/commodityType'
import { SkuMap } from './skuMap'
import { Skus } from '../domain/skus'
import { AttributeMap } from './attributeMap'
import { Attributes } from '../domain/attributes'

export class CommodityMap implements IMapper<Commodity> {
  public static async toListDto(commodityList: Commodity[]): Promise<CommodityDto[]> {
    let commodityDtoList = []
    for (let item of commodityList) {
      commodityDtoList.push(await this.toDTO(item))
    }
    return commodityDtoList
  }

  public static async toDTO(commodity: Commodity): Promise<CommodityDto> {
    const skus = commodity.skus.getItems().map((item) => SkuMap.toDTO(item))
    const attributes = commodity.attributes.getItems().map((item) => AttributeMap.toDTO(item))
    return {
      _id: commodity.id.toString(),
      name: commodity.name.value,
      description: commodity.description,
      images: commodity.images,
      fakeAmount: commodity.fakeAmount,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      limitedPurchasePerPerson: commodity.limitedPurchasePerPerson,
      tags: commodity.tags,
      imgesDescrptionList: commodity.imgesDescrptionList,
      type: commodity.type,
      strategyTags: commodity.strategyTags,
      categoryId: commodity.categoryId,
      skus: skus,
      attributes: attributes,
    }
  }

  public static toDomain(raw: ICommodityDbModel): Commodity {
    if (!raw) {
      return null
    }

    const commodityNameOrErrors = CommodityName.create({ name: raw.name })
    const skus = Skus.create(raw.skus.map((item) => SkuMap.toDomain(item)))
    const attributes = Attributes.create(raw.attributes.map((item) => AttributeMap.toDomain(item)))

    const commodityOrError = Commodity.create(
      {
        name: commodityNameOrErrors.getValue(),
        description: raw.description,
        images: raw.images,
        fakeAmount: raw.fakeAmount,
        sales: raw.sales,
        restrictedPurchaseQuantity: raw.restrictedPurchaseQuantity,
        limitedPurchasePerPerson: raw.limitedPurchasePerPerson,
        tags: raw.tags,
        imgesDescrptionList: raw.imgesDescrptionList,
        type: raw.type as CommodityType,
        strategyTags: raw.strategyTags,
        categoryId: raw.categoryId,
        skus: skus,
        attributes: attributes,
      },
      new UniqueEntityID(raw._id)
    )

    commodityOrError.isFailure ? console.log(commodityOrError.error) : ''
    return commodityOrError.isSuccess ? commodityOrError.getValue() : null
  }

  public static toPersistence(commodity: Commodity): ICommodityDbModel {
    const skus = commodity.skus.getItems().map((item) => SkuMap.toPersistence(item))
    const attributes = commodity.attributes.getItems().map((item) => AttributeMap.toPersistence(item))
    return {
      _id: commodity.id.toString(),
      name: commodity.name.value,
      description: commodity.description,
      images: commodity.images,
      fakeAmount: commodity.fakeAmount,
      sales: commodity.sales,
      restrictedPurchaseQuantity: commodity.restrictedPurchaseQuantity,
      limitedPurchasePerPerson: commodity.limitedPurchasePerPerson,
      tags: commodity.tags,
      imgesDescrptionList: commodity.imgesDescrptionList,
      type: commodity.type,
      strategyTags: commodity.strategyTags,
      categoryId: commodity.categoryId,
      skus: skus,
      attributes: attributes,
    }
  }

  public static dtoToDomain(commodityDto: CommodityDto): Commodity {
    if (!commodityDto) {
      return null
    }

    const commodityNameOrErrors = CommodityName.create({ name: commodityDto.name })
    const skus = Skus.create(commodityDto.skus.map((item) => SkuMap.toDomain(item)))
    const attributes = Attributes.create(commodityDto.attributes.map((item) => AttributeMap.toDomain(item)))

    const commodityOrError = Commodity.create(
      {
        name: commodityNameOrErrors.getValue(),
        description: commodityDto.description,
        images: commodityDto.images,
        fakeAmount: commodityDto.fakeAmount,
        sales: commodityDto.sales,
        restrictedPurchaseQuantity: commodityDto.restrictedPurchaseQuantity,
        limitedPurchasePerPerson: commodityDto.limitedPurchasePerPerson,
        tags: commodityDto.tags,
        imgesDescrptionList: commodityDto.imgesDescrptionList,
        type: commodityDto.type as CommodityType,
        strategyTags: commodityDto.strategyTags,
        categoryId: commodityDto.categoryId,
        skus: skus,
        attributes: attributes,
      },
      new UniqueEntityID(commodityDto._id)
    )

    commodityOrError.isFailure ? console.log(commodityOrError.error) : ''
    return commodityOrError.isSuccess ? commodityOrError.getValue() : null
  }
}
