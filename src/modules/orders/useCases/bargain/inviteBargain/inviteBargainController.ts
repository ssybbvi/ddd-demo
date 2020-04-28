import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { InviteBargainUseCase } from './inviteBargainUseCase'
import { InviteBargainDto } from './inviteBargainDto'
import { InviteBargainErrors } from './inviteBargainErrors'

export class InviteBargainController extends BaseController {
  private useCase: InviteBargainUseCase

  constructor(useCase: InviteBargainUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: InviteBargainDto = req.body as InviteBargainDto
    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case InviteBargainErrors.ExpiredError:
            return this.fail(res, error.errorValue().message)
          case InviteBargainErrors.IsFinishError:
            return this.fail(res, error.errorValue().message)
          case InviteBargainErrors.HasParticipantError:
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
