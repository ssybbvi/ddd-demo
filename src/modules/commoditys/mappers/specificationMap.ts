import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Specification } from '../domain/specification'
import { ISpecificationDto } from '../dtos/specificationDto'
import { ISpecificationDbModel } from '../dbModels/specificationDbModel'

export class SpecificationMap implements IMapper<Specification> {
  public static toDtoList(specificationList: Specification[]) {
    const list = []
    for (let item of specificationList) {
      list.push(this.toDTO(item))
    }
    return list
  }

  public static toDTO(specification: Specification): ISpecificationDto {
    return {
      _id: specification.id.toString(),
      name: specification.name,
      icon: specification.icon,
    }
  }

  public static toDomain(raw: ISpecificationDbModel): Specification {
    if (raw == null) {
      return null
    }

    const specificationOrError = Specification.create(
      {
        name: raw.name,
        icon: raw.icon,
      },
      new UniqueEntityID(raw._id)
    )

    specificationOrError.isFailure ? console.log(specificationOrError.error) : ''
    return specificationOrError.isSuccess ? specificationOrError.getValue() : null
  }

  public static toPersistence(specification: Specification): ISpecificationDbModel {
    return {
      _id: specification.id.toString(),
      name: specification.name,
      icon: specification.icon,
    }
  }
}
