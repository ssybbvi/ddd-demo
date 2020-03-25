import { BaseController } from '../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../infra/http/models/decodedRequest'
import { AdminAboutMeDto } from './adminAboutMeDto'

export class AdminAboutMeController extends BaseController {

  constructor() {
    super()
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: AdminAboutMeDto = req.body as AdminAboutMeDto

    try {

      return this.ok(res, {
        avatar: 'test-avatar',
        email: "xxxxx",
        name: "xxxx",
        title: 'test-title',
        group: 'test-group',
        signature: 'test-signature',
        tags: [
          {
            key: 'test-key',
            label: 'test-label'
          }
        ],
        userid: "",
        unreadCount: 123,
        notifyCount: 123
      })
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
