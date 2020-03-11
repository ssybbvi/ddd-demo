import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { Fund } from '../../../domain/fund'
import { FundDto } from '../../../dtos/fundDto'
import { FundMap } from '../../../mappers/fundMap'
import { GetFundAccountUseCase } from './getFundAccountUseCase'
import { GetFundAccountDto } from './getFundAccountDto'
import { FundAccountDto } from '../../../dtos/fundAccountDto'
import { FundAccountMap } from '../../../mappers/fundAccountMap'
import { FundAccount } from '../../../domain/fundAccount'

export class GetFundAccountController extends BaseController {
  private useCase: GetFundAccountUseCase

  constructor(useCase: GetFundAccountUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetFundAccountDto = {
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
        const fundAccount: FundAccount = useCaseValue.getValue() as FundAccount
        let fundAccountDto = FundAccountMap.toDTO(fundAccount)
        return this.ok<FundAccountDto>(res, fundAccountDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
