import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { ICommodityTagRepo } from '../../../repos/iCommodityTagRepo'
import { UpdateCommodityTagDto } from './updateCommodityTagDto'
import { UpdateCommodityTagErrors } from './updateCommodityTagErrors'

type Response = Either<AppError.UnexpectedError | UpdateCommodityTagErrors.NotExistKey, Result<void>>

export class UpdateCommodityTagUseCase implements UseCase<UpdateCommodityTagDto, Promise<Response>> {
  private commodityTagRepo: ICommodityTagRepo

  constructor(commodityTagRepo: ICommodityTagRepo) {
    this.commodityTagRepo = commodityTagRepo
  }

  public async execute(request: UpdateCommodityTagDto): Promise<Response> {
    try {
      const { _id, name, description } = request

      const commodityTag = await this.commodityTagRepo.getById(_id)
      if (!commodityTag) {
        return left(new UpdateCommodityTagErrors.NotExistKey())
      }
      commodityTag.updateName(name)
      commodityTag.updateDescrption(description)

      await this.commodityTagRepo.save(commodityTag)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
