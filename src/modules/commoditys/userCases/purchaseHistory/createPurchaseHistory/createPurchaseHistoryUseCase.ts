import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { PurchaseHistory } from '../../../domain/purchaseHistory'
import { IPurchaseHistoryRepo } from '../../../repos/iPurchaseHistoryRepo'
import { CreatePurchaseHistoryDto } from './createPurchaseHistoryDto'
import { IUserRepo } from '../../../../users/repos/userRepo'
import { IWxUserRepo } from '../../../../users/repos/wxUserRepo'

type Response = Either<AppError.UnexpectedError | Result<PurchaseHistory>, Result<void>>

export class CreatePurchaseHistoryUseCase implements UseCase<CreatePurchaseHistoryDto, Promise<Response>> {
  private purchaseHistoryRepo: IPurchaseHistoryRepo

  constructor(purchaseHistoryRepo: IPurchaseHistoryRepo) {
    this.purchaseHistoryRepo = purchaseHistoryRepo
  }

  public async execute(request: CreatePurchaseHistoryDto): Promise<Response> {
    try {
      const { userId, commodityId } = request

      const purchaseHistoryOrEerros = PurchaseHistory.create({
        userId: userId,
        commodityId: commodityId,
      })

      if (purchaseHistoryOrEerros.isFailure) {
        return left(purchaseHistoryOrEerros)
      }

      await this.purchaseHistoryRepo.save(purchaseHistoryOrEerros.getValue())
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
