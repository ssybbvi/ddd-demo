import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateThirdPartyAppUseCase } from './createThirdPartyAppUseCase'
import { CreateThirdPartyAppDto } from './createThirdPartyAppDto'



export class CreateThirdPartyAppController extends BaseController {
  private useCase: CreateThirdPartyAppUseCase

  constructor(useCase: CreateThirdPartyAppUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: CreateThirdPartyAppDto = { name: req.body.name }
    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
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
