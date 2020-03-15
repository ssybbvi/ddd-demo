import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetFundListUseCase } from './getFundListUseCase'
import { GetFundListDto } from './getFundListDto'
import { Fund } from '../../../domain/fund'
import { FundDto } from '../../../dtos/fundDto'
import { FundMap } from '../../../mappers/fundMap'

export class GetFundListController extends BaseController {
  private useCase: GetFundListUseCase

  constructor(useCase: GetFundListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetFundListDto = {
      memberId: userId
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
        const fundList: Fund[] = useCaseValue.getValue() as Fund[]
        let fundDtoList = fundList.map(item => FundMap.toDTO(item))
        return this.ok<FundDto[]>(res, fundDtoList)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
