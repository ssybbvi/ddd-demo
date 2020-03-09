import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetDistributionMemberUseCase } from './getDistributionMemberUseCase'
import { GetDistributionMemberDto } from './getDistributionMemberDto'
import { GetDistributionMemberDtoResult } from './getDistributionMemberDtoResult'

export class GetDistributionMemberController extends BaseController {
  private useCase: GetDistributionMemberUseCase

  constructor(useCase: GetDistributionMemberUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetDistributionMemberDto = {
      memberId: userId,
      termType: req.query.termType,
      offset: req.query.offset
    }

    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      } else {
        const getDistributionMemberDtoResult: GetDistributionMemberDtoResult = useCaseValue.getValue() as GetDistributionMemberDtoResult
        return this.ok<GetDistributionMemberDtoResult>(res, getDistributionMemberDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
