import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetDistributionRecommendedUserUseCase } from './getDistributionRecommendedUserUseCase'
import { GetDistributionRecommendedUserDto } from './getDistributionRecommendedUserDto'
import {
  GetDistributionRecommendedUserDtoResult,
  GetDistributionRecommendedUserResult,
} from './getDistributionRecommendedUserDtoResult'
import { TeamMap } from '../../../mappers/teamMap'

export class GetDistributionRecommendedUserController extends BaseController {
  private useCase: GetDistributionRecommendedUserUseCase

  constructor(useCase: GetDistributionRecommendedUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetDistributionRecommendedUserDto = {
      recommendedUserId: userId,
    }

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const {
          primaryDistributionTeams,
          secondaryDistributionTeams,
          primaryDistributionByTodayTeams,
          secondaryDistributionByTodayTeams,
        }: GetDistributionRecommendedUserResult = result.value.getValue() as GetDistributionRecommendedUserResult

        return this.ok<GetDistributionRecommendedUserDtoResult>(res, {
          primaryDistributionTeams: await TeamMap.toDtoList(primaryDistributionTeams),
          secondaryDistributionTeams: await TeamMap.toDtoList(secondaryDistributionTeams),
          primaryDistributionByTodayTeams: await TeamMap.toDtoList(primaryDistributionByTodayTeams),
          secondaryDistributionByTodayTeams: await TeamMap.toDtoList(secondaryDistributionByTodayTeams),
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
