import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { GetPurchaseHistoryDto } from './getPurchaseHistoryDto'
import { IPurchaseHistoryRepo } from '../../../repos/iPurchaseHistoryRepo'
import { PurchaseHistory } from '../../../domain/purchaseHistory'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<PurchaseHistory[]>>

export class GetPurchaseHistoryUseCase implements UseCase<GetPurchaseHistoryDto, Promise<Response>> {
  private purchaseHistoryRepo: IPurchaseHistoryRepo

  constructor(purchaseHistoryRepo: IPurchaseHistoryRepo) {
    this.purchaseHistoryRepo = purchaseHistoryRepo
  }

  public async execute(request: GetPurchaseHistoryDto): Promise<Response> {
    try {
      const list = await this.purchaseHistoryRepo.filter(request.commodityId)
      return right(Result.ok<PurchaseHistory[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
