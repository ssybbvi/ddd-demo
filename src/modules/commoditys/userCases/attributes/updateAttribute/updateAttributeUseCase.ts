import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Attribute } from '../../../domain/attribute'
import { IAttributeRepo } from '../../../repos/iAttributeRepo'
import { IUpdateAttributeDto } from './updateAttributeDto'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class UpdateAttributeUseCase implements UseCase<IUpdateAttributeDto, Promise<Response>> {
  private attributeRepo: IAttributeRepo

  constructor(attributeRepo: IAttributeRepo) {
    this.attributeRepo = attributeRepo
  }

  public async execute(request: IUpdateAttributeDto): Promise<Response> {
    try {
      const { _id, name, categoryId } = request

      const attribute = await this.attributeRepo.getById(_id)

      attribute.updateName(name)
      attribute.updateCategoryId(categoryId)

      await this.attributeRepo.save(attribute)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
