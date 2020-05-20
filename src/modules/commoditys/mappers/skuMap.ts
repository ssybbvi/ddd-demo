import { IMapper } from '../../../shared/infra/Mapper'
import { ISkuDbModel, ISkuSpecificationDbModel } from '../dbModels/skuDbModel'
import { Sku } from '../domain/sku'
import { ISkuDto, ISkuSpecificationDto } from '../dtos/skuDto'
import { SkuSpecification } from '../domain/skuSpecification'

export class SkuMap implements IMapper<Sku> {
  public static async toDtoList(skuList: Sku[]) {
    const list = []
    for (let item of skuList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  public static combinesToDto(skuSpecifications: SkuSpecification[]): ISkuSpecificationDto[] {
    return skuSpecifications.map((item) => {
      return {
        attributeId: item.attributeId,
        specificationId: item.specificationId,
      }
    })
  }

  public static toDTO(sku: Sku): ISkuDto {
    return {
      _id: sku.id.toString(),
      name: sku.name,
      code: sku.code,
      price: sku.price,
      stock: sku.stock,
      isSufficient: sku.isSufficient,
      combines: this.combinesToDto(sku.combines),
    }
  }

  public static combinesToDomain(skuSpecificationDbModels: ISkuSpecificationDbModel[]): SkuSpecification[] {
    return skuSpecificationDbModels.map((item) => {
      let skuSpecificationOrError = SkuSpecification.create({
        attributeId: item.attributeId,
        specificationId: item.specificationId,
      })

      skuSpecificationOrError.isFailure ? console.log(skuSpecificationOrError.error) : ''
      return skuSpecificationOrError.getValue()
    })
  }

  public static toDomain(raw: ISkuDbModel): Sku {
    if (raw == null) {
      return null
    }

    const skuOrError = Sku.create({
      name: raw.name,
      code: raw.code,
      price: raw.price,
      stock: raw.stock,
      isSufficient: raw.isSufficient,
      combines: this.combinesToDomain(raw.combines),
    })

    skuOrError.isFailure ? console.log(skuOrError.error) : ''
    return skuOrError.isSuccess ? skuOrError.getValue() : null
  }

  public static combinesToPersistence(skuSpecifications: SkuSpecification[]): ISkuSpecificationDbModel[] {
    return skuSpecifications.map((item) => {
      return {
        attributeId: item.attributeId,
        specificationId: item.specificationId,
      }
    })
  }

  public static toPersistence(sku: Sku): ISkuDbModel {
    return {
      name: sku.name,
      code: sku.code,
      price: sku.price,
      stock: sku.stock,
      isSufficient: sku.isSufficient,
      combines: this.combinesToPersistence(sku.combines),
    }
  }
}
