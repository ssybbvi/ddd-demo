import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { GetPermissionRequestDto } from './getPermissionRequestDto'
import { GetPermissionUseCase } from './getPermissionUseCase'
import { GetPermissionResponseDto } from './getPermissionResponseDto'
import { PermissionMap } from '../../../mappers/permissionMap'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import * as express from 'express'

export class GetPermissionController extends BaseController {
  private useCase: GetPermissionUseCase

  constructor(useCase: GetPermissionUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const dto: GetPermissionRequestDto = {
      offset: req.query.offset,
      userId: !!req.decoded === true ? req.decoded.userId : null,
    }

    try {
      const result = await this.useCase.execute(dto)
      const resultValue = result.value
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const permissionDtoList = resultValue.getValue()
        return this.ok<GetPermissionResponseDto>(res, {
          permissions: permissionDtoList,
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
