import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { InviteBargainOrderUseCase } from './inviteBargainOrderUseCase'
import { InviteBargainOrderDto } from './inviteBargainOrderDto'
import { InviteBargainOrderErrors } from './inviteBargainOrderErrors'

export class InviteBargainOrderController extends BaseController {
  private useCase: InviteBargainOrderUseCase

  constructor(useCase: InviteBargainOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: InviteBargainOrderDto = req.body as InviteBargainOrderDto
    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case InviteBargainOrderErrors.ExpiredError:
            return this.fail(res, error.errorValue().message)
          case InviteBargainOrderErrors.IsFinishError:
            return this.fail(res, error.errorValue().message)
          case InviteBargainOrderErrors.HasParticipantError:
            return this.fail(res, error.errorValue().message)
          default:
            return this.fail(res, error.errorValue())
        }
      }


      return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
