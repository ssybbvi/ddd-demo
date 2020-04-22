import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'

import { BargainOrder } from '../../../domain/bargainOrder'
import { IBargainOrderRepo } from '../../../repos/bargainOrderRepo'
import { InviteBargainOrderDto } from './inviteBargainOrderDto'
import { InviteBargainOrderErrors } from './inviteBargainOrderErrors'


type Response = Either<AppError.UnexpectedError, Result<void>>


export class InviteBargainOrderUseCase implements UseCase<InviteBargainOrderDto, Promise<Response>> {
  private bargainOrderRepo: IBargainOrderRepo

  constructor(
    bargainOrderRepo: IBargainOrderRepo) {
    this.bargainOrderRepo = bargainOrderRepo
  }


  public async execute(request: InviteBargainOrderDto): Promise<Response> {
    try {
      const { userId, bargainOrderId } = request

      const bargainOrder = await this.bargainOrderRepo.getById(bargainOrderId)
      if (!bargainOrder) {
        return left(new InviteBargainOrderErrors.BargainNotFondErrors())
      }

      if (bargainOrder.isExpired()) {
        return left(new InviteBargainOrderErrors.ExpiredError())
      }

      if (bargainOrder.isSuccess) {
        return left(new InviteBargainOrderErrors.IsFinishError())
      }

      if (bargainOrder.isHasParticipants(userId)) {
        return left(new InviteBargainOrderErrors.HasParticipantError())
      }

      bargainOrder.bargain(userId)

      await this.bargainOrderRepo.save(bargainOrder)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }



}
