import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../infra/http/models/decodedRequest'
import { RecommendedByInviteTokenDto } from './recommendedByInviteTokenDto'
import { RecommendedByInviteTokenUseCase } from './recommendedByInviteTokenUseCase'
import { RecommendedByInviteTokenErrors } from './recommendedByInviteTokenErrors'

export class RecommendedByInviteTokenController extends BaseController {
  private useCase: RecommendedByInviteTokenUseCase

  constructor(useCase: RecommendedByInviteTokenUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { inviteToken } = req.body as RecommendedByInviteTokenDto
    const { userId } = req.decoded
    const dto: RecommendedByInviteTokenDto = { inviteToken, userId }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        return this.ok<void>(res)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
