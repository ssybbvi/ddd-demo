import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { GetRoleReqeustDto } from './getRoleReqeustDto'
import { GetRoleUseCase } from './getRoleUseCase'
import { GetRoleResponseDto } from './getRoleResponseDto'
import { RoleMap } from '../../../mappers/roleMap'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import * as express from 'express'

export class GetRoleController extends BaseController {
  private useCase: GetRoleUseCase

  constructor(useCase: GetRoleUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: GetRoleReqeustDto = {
      offset: req.query.offset,
      userId: !!req.decoded === true ? req.decoded.userId : null,
    }

    try {
      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const roleDtoList = resultValue.getValue()
        return this.ok<GetRoleResponseDto>(res, {
          roles: roleDtoList,
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
