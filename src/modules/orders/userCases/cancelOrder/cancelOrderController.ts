import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../users/infra/http/models/decodedRequest'
import { CancelOrderUseCase } from './cancelOrderUseCase'



export class CancelOrderController extends BaseController {
  private useCase: CancelOrderUseCase

  constructor(useCase: CancelOrderUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {

    try {
      const result = await this.useCase.execute({})
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }
        return this.ok<void>(res)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
