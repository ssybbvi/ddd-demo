import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { CreateUpUserUseDto } from './createUpUserDto'
import { CreateUpUserErrors } from './createUpUserErrors'
import { CreateUpUserUseCase } from './createUpUserUseCase'

export class CreateUpUserController extends BaseController {
  private useCase: CreateUpUserUseCase

  constructor(useCase: CreateUpUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateUpUserUseDto = req.body as CreateUpUserUseDto

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
