import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { PurchaseHistory } from '../../../domain/purchaseHistory'
import { IPurchaseHistoryRepo } from '../../../repos/iPurchaseHistoryRepo'
import { CreatePurchaseHistoryDto } from './createPurchaseHistoryDto'
import { IUserRepo } from '../../../../users/repos/userRepo'
import { IWxUserRepo } from '../../../../users/repos/wxUserRepo'

type Response = Either<AppError.UnexpectedError, Result<void>>

export class CreatePurchaseHistoryUseCase implements UseCase<CreatePurchaseHistoryDto, Promise<Response>> {
  private purchaseHistoryRepo: IPurchaseHistoryRepo
  private wxUserRepo: IWxUserRepo

  constructor(purchaseHistoryRepo: IPurchaseHistoryRepo, wxUserRepo: IWxUserRepo) {
    this.purchaseHistoryRepo = purchaseHistoryRepo
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: CreatePurchaseHistoryDto): Promise<Response> {
    try {
      const { userId, commodityId } = request

      const wxUser = await this.wxUserRepo.getById(userId)

      const purchaseHistoryOrEerros = PurchaseHistory.create({
        userId: userId,
        commodityId: commodityId,
        nickName: wxUser.nickName,
        avatarUrl: wxUser.avatarUrl,
        gender: wxUser.gender
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
