import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ISpecificationRepo } from '../../../repos/iSpecificationRepo'
import { IUpdateSpecificationDto } from './updateSpecificationDto'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class UpdateSpecificationUseCase implements UseCase<IUpdateSpecificationDto, Promise<Response>> {
  private specificationRepo: ISpecificationRepo

  constructor(specificationRepo: ISpecificationRepo) {
    this.specificationRepo = specificationRepo
  }

  public async execute(request: IUpdateSpecificationDto): Promise<Response> {
    try {
      const { _id, name, attributeId, icon } = request

      const specification = await this.specificationRepo.getById(_id)

      specification.updateName(name)
      specification.updateAttributeId(attributeId)
      specification.updateIconn(icon)

      await this.specificationRepo.save(specification)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
