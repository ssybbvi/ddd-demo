import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import { DecodedExpressRequest } from '../../infra/http/models/decodedRequest'
import { GetUserByUserName } from '../getUserByUserName/GetUserByUserName'
import { UserMap } from '../../mappers/userMap'
import * as express from 'express'

export class GetCurrentUserController extends BaseController {
  private useCase: GetUserByUserName

  constructor(useCase: GetUserByUserName) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    console.log('usernameusername:', userId)
    try {
      const result = await this.useCase.execute({ userId })

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message)
      } else {
        const user = result.value.getValue()
        return this.ok(res, {
          user: UserMap.toLoginMe(user)
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
