import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityTagRepo } from '../../../repos/iCommodityTagRepo'
import { CommodityTag } from '../../../domain/commodityTag'
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID'
import { CreateCommodityTagErrors } from './createCommodityTagErrors'
import { CreateCommodityTagDto } from './createCommodityTagDto'

type Response = Either<AppError.UnexpectedError | CreateCommodityTagErrors.ExistKey, Result<void>>

export class CreateCommodityTagUseCase implements UseCase<CreateCommodityTagDto, Promise<Response>> {
  private commodityTagRepo: ICommodityTagRepo

  constructor(commodityTagRepo: ICommodityTagRepo) {
    this.commodityTagRepo = commodityTagRepo
  }

  public async execute(request: CreateCommodityTagDto): Promise<Response> {
    try {
      const { name, description, tag } = request

      const commodityTag = await this.commodityTagRepo.existTag(tag)
      if (commodityTag) {
        return left(new CreateCommodityTagErrors.ExistKey())
      }

      const commodityTagOrErrors = CommodityTag.create({
        name, description, tag
      })

      if (commodityTagOrErrors.isFailure) {
        return left(commodityTagOrErrors)
      }

      await this.commodityTagRepo.save(commodityTagOrErrors.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
