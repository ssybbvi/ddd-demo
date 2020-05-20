import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { Attribute } from '../../../domain/attribute'
import { IAttributeRepo } from '../../../repos/iAttributeRepo'
import { IGetAttributeListDto } from './getAttributeListDto'

type Response = Either<AppError.UnexpectedError, Result<Attribute[]>>

export class GetAttributeListUseCase implements UseCase<IGetAttributeListDto, Promise<Response>> {
  private attributeRepo: IAttributeRepo

  constructor(attributeRepo: IAttributeRepo) {
    this.attributeRepo = attributeRepo
  }

  public async execute(request: IGetAttributeListDto): Promise<Response> {
    try {
      const list = await this.attributeRepo.filter()
      return right(Result.ok<Attribute[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
