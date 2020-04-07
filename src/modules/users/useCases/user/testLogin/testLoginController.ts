import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { TestLoginUseCase } from './testLoginUseCase'
import { TestLoginDto } from './testLoginDto'
import { LoginDTOResponse } from '../login/LoginDTO'

export class TestLoginController extends BaseController {
  private useCase: TestLoginUseCase

  constructor(useCase: TestLoginUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: TestLoginDto = req.body as TestLoginDto

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
        return this.ok<LoginDTOResponse>(res, useCaseValue.getValue())
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
