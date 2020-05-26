import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Commodity } from '../../../domain/commodity'
import { CreateCommodityDto } from './createCommodityDto'
import { ICommodityRepo } from '../../../repos/iCommodityRepo'
import { CommodityName } from '../../../domain/commodityName'
import { CommodityAmount } from '../../../domain/commodityAmount'
import { CommodityType } from '../../../domain/commodityType'
import { Sku } from '../../../domain/sku'
import { Skus } from '../../../domain/skus'
import { SkuSpecification } from '../../../domain/skuSpecification'
import { Attribute } from '../../../domain/attribute'
import { Specification } from '../../../domain/specification'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { Specifications } from '../../../domain/specifications'
import { Attributes } from '../../../domain/attributes'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreateCommodityUseCase implements UseCase<CreateCommodityDto, Promise<Response>> {
  private commodityRepo: ICommodityRepo

  constructor(commodityRepo: ICommodityRepo) {
    this.commodityRepo = commodityRepo
  }

  public async execute(request: CreateCommodityDto): Promise<Response> {
    try {
      const {
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

      const commodityOrErrors = Commodity.create({
        name: commodityNameOrErrors.getValue(),
        description,
        images,
        fakeAmount,
        sales,
        restrictedPurchaseQuantity,
        limitedPurchasePerPerson,
        tags,
        imgesDescrptionList,
        type: type as CommodityType,
        strategyTags,
        categoryId,
        skus: Skus.create(skuList),
        attributes: Attributes.create(attributeList),
      })

      if (commodityOrErrors.isFailure) {
        return left(commodityOrErrors)
      }

      await this.commodityRepo.save(commodityOrErrors.getValue())

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
