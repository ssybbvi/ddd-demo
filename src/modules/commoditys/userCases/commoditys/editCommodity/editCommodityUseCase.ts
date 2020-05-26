import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { IEditCommodityDto } from './editCommodityDto'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityAmount } from '../../../domain/commodityAmount'
import { CommodityType } from '../../../domain/commodityType'
import { SkuSpecification } from '../../../domain/skuSpecification'
import { Sku } from '../../../domain/sku'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { Specification } from '../../../domain/specification'
import { Attribute } from '../../../domain/attribute'
import { Specifications } from '../../../domain/specifications'
import { Attributes } from '../../../domain/attributes'
import { Skus } from '../../../domain/skus'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class EditCommodityUseCase implements UseCase<IEditCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: IEditCommodityDto): Promise<Response> {
    try {
      const {
        _id,
        name,
        description,
        images,
        fakeAmount,
        sales,
        restrictedPurchaseQuantity,
        tags,
        imgesDescrptionList,
        limitedPurchasePerPerson,
        type,
        strategyTags,
        categoryId,
        skus,
        attributes,
      } = request

      const commodity = await this.commodityRepo.getById(_id)

      const commodityNameOrErrors = CommodityName.create({ name })
      if (commodityNameOrErrors.isFailure) {
        return left(commodityNameOrErrors)
      }

      const skuList = []
      for (let sku of skus) {
        let combines = []
        for (let skuSpecification of sku.combines) {
          const skuSpecificationOrError = SkuSpecification.create({
            attributeId: skuSpecification.attributeId,
            specificationId: skuSpecification.specificationId,
          })

          if (skuSpecificationOrError.isFailure) {
            return left(skuSpecificationOrError)
          }
          combines.push(skuSpecificationOrError.getValue())
        }

        const skuOrError = Sku.create(
          {
            name: sku.name,
            code: sku.code,
            price: sku.price,
            stock: sku.stock,
            isSufficient: sku.isSufficient,
            combines: combines,
          },
          new UniqueEntityID(sku._id)
        )

        if (skuOrError.isFailure) {
          return left(skuOrError)
        }
        skuList.push(skuOrError.getValue())
      }

      const attributeList = []
      for (let attribute of attributes) {
        const specificationList = []
        for (let specification of attribute.specifications) {
          const specificationOrError = Specification.create(
            {
              name: specification.name,
              icon: specification.icon,
            },
            new UniqueEntityID(specification._id)
          )

          if (specificationOrError.isFailure) {
            return left(specificationOrError)
          }
          specificationList.push(specificationOrError.getValue())
        }

        const attributeOrError = Attribute.create(
          {
            name: attribute.name,
            specifications: Specifications.create(specificationList),
          },
          new UniqueEntityID(attribute._id)
        )
        if (attributeOrError.isFailure) {
          return left(attributeOrError)
        }
        attributeList.push(attributeOrError.getValue())
      }

      commodity.updateName(commodityNameOrErrors.getValue())
      commodity.updateDescrption(description)
      commodity.updateFakeAmount(fakeAmount)
      commodity.updateImages(images)
      commodity.updateTags(tags)
      commodity.updateRestrictedPurchaseQuantity(restrictedPurchaseQuantity)
      commodity.updateImgesDescrptionList(imgesDescrptionList)
      commodity.updateType(type as CommodityType)
      commodity.updateAttributes(Attributes.create(attributeList))
      commodity.updateCategoryId(categoryId)
      commodity.updateSkus(Skus.create(skuList))
      commodity.updateStrategyTags(strategyTags)
      commodity.updateLimitedPurchasePerPerson(limitedPurchasePerPerson)

      await this.commodityRepo.save(commodity)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
