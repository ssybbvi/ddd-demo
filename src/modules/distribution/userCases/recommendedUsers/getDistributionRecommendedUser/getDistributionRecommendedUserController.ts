import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetDistributionRecommendedUserUseCase } from './getDistributionRecommendedUserUseCase'
import { GetDistributionRecommendedUserDto } from './getDistributionRecommendedUserDto'
import { GetDistributionRecommendedUserDtoResult } from './getDistributionRecommendedUserDtoResult'

export class GetDistributionRecommendedUserController extends BaseController {
  private useCase: GetDistributionRecommendedUserUseCase

  constructor(useCase: GetDistributionRecommendedUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetDistributionRecommendedUserDto = {
      recommendedUserId: userId
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
        const getDistributionRecommendedUserDtoResult: GetDistributionRecommendedUserDtoResult = useCaseValue.getValue() as GetDistributionRecommendedUserDtoResult
        return this.ok<GetDistributionRecommendedUserDtoResult>(res, getDistributionRecommendedUserDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
