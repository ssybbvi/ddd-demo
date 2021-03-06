import { Either, Result, right, left } from '../../../../../shared/core/Result'
import { AppError } from '../../../../../shared/core/AppError'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IBargainRepo } from '../../../repos/bargainRepo'
import { InviteBargainDto } from './inviteBargainDto'
import { InviteBargainErrors } from './inviteBargainErrors'
import { ExpiredError, IsFinishError } from '../../../domain/bargain'
import { RepeatShipmentError } from '../../../domain/deliveryInfo'

type Response = Either<
  | AppError.UnexpectedError
  | ExpiredError
  | IsFinishError
  | Result<any>
  | RepeatShipmentError
  | AppError.UnexpectedError,
  Result<void>
>

export class InviteBargainUseCase implements UseCase<InviteBargainDto, Promise<Response>> {
  private bargainRepo: IBargainRepo

  constructor(bargainRepo: IBargainRepo) {
    this.bargainRepo = bargainRepo
  }

  public async execute(request: InviteBargainDto): Promise<Response> {
    try {
      const { userId, bargainId } = request

      const bargain = await this.bargainRepo.getById(bargainId)
      if (!bargain) {
        return left(new InviteBargainErrors.NotFoundErrors())
      }

      // if (bargain.isHasParticipants(userId)) {
      //   return left(new InviteBargainErrors.HasParticipantError())
      // }

      const particpantsCountByUserId = await this.bargainRepo.getParticpantsCountByUserId(userId)
      const weights = Math.pow(0.9, particpantsCountByUserId)

      const bargainResult = bargain.bargain(userId, weights)
      if (bargainResult.isLeft()) {
        return left(bargainResult.value)
      }

      await this.bargainRepo.save(bargain)

      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
