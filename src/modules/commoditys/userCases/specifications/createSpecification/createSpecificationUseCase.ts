import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Specification } from '../../../domain/specification'
import { ISpecificationRepo } from '../../../repos/iSpecificationRepo'
import { ICreateSpecificationDto } from './createSpecificationDto'

type Response = Either<AppError.UnexpectedError | Result<Specification>, Result<void>>

export class CreateSpecificationUseCase implements UseCase<ICreateSpecificationDto, Promise<Response>> {
  private specificationRepo: ISpecificationRepo

  constructor(specificationRepo: ISpecificationRepo) {
    this.specificationRepo = specificationRepo
  }

  public async execute(request: ICreateSpecificationDto): Promise<Response> {
    try {
      const { name, attributeId, icon } = request

      const specificationOrEerros = Specification.create({
        name,
        attributeId,
        icon,
      })

      if (specificationOrEerros.isFailure) {
        return left(specificationOrEerros)
      }

      await this.specificationRepo.save(specificationOrEerros.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
