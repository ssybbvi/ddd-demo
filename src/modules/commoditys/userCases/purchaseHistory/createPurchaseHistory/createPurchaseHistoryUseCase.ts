import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { PurchaseHistory } from '../../../domain/purchaseHistory'
import { IPurchaseHistoryRepo } from '../../../repos/iPurchaseHistoryRepo'
import { CreatePurchaseHistoryDto } from './createPurchaseHistoryDto'
import { IUserRepo } from '../../../../users/repos/userRepo'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class CreatePurchaseHistoryUseCase implements UseCase<CreatePurchaseHistoryDto, Promise<Response>> {
  private purchaseHistoryRepo: IPurchaseHistoryRepo
  private userRepo: IUserRepo

  constructor(purchaseHistoryRepo: IPurchaseHistoryRepo, userRepo: IUserRepo) {
    this.purchaseHistoryRepo = purchaseHistoryRepo
    this.userRepo = userRepo
  }

  public async execute(request: CreatePurchaseHistoryDto): Promise<Response> {
    try {
      const { userId, commodityId } = request

      const user = await this.userRepo.getById(userId)

      const purchaseHistoryOrEerros = PurchaseHistory.create({
        userId: userId,
        commodityId: commodityId,
        nickName: user.platform.wx!.value.nickName,
        avatarUrl: user.platform.wx!.value.avatarUrl,
        gender: user.platform.wx!.value.gender,
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
