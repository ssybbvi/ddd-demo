import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Attribute } from '../../../domain/attribute'
import { IAttributeRepo } from '../../../repos/iAttributeRepo'
import { ICreateAttributeDto } from './createAttributeDto'

type Response = Either<AppError.UnexpectedError | Result<Attribute>, Result<void>>

export class CreateAttributeUseCase implements UseCase<ICreateAttributeDto, Promise<Response>> {
  private attributeRepo: IAttributeRepo

  constructor(attributeRepo: IAttributeRepo) {
    this.attributeRepo = attributeRepo
  }

  public async execute(request: ICreateAttributeDto): Promise<Response> {
    try {
      const { name, categoryId } = request

      const attributeOrEerros = Attribute.create({
        name,
        categoryId,
      })

      if (attributeOrEerros.isFailure) {
        return left(attributeOrEerros)
      }

      await this.attributeRepo.save(attributeOrEerros.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
