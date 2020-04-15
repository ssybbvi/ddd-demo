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

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue().message)
        }
      } else {
        const getDistributionRecommendedUserDtoResult: GetDistributionRecommendedUserDtoResult = result.value.getValue() as GetDistributionRecommendedUserDtoResult
        return this.ok<GetDistributionRecommendedUserDtoResult>(res, getDistributionRecommendedUserDtoResult)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
