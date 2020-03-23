import { GetAuthorityUserListUseCase } from './getAuthorityUserUseCase'
import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import { GetAuthorityUserResponseDto } from './getAuthorityUserResponseDto'
//import { AuthorityUserDetailsMap } from '../../../mappers/authorityUserDetailsMap'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'

export class GetAuthorityUserListController extends BaseController {
  private useCase: GetAuthorityUserListUseCase

  constructor(useCase: GetAuthorityUserListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute(req)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }

      const authorityUserDetailsList = result.value.getValue()

      return this.ok<GetAuthorityUserResponseDto>(res, {
        authorityUsers:[] //authorityUserDetailsList.map(item => AuthorityUserDetailsMap.toDTO(item))
      })
    } catch (err) {
      return this.fail(res, err)
    }
  }
}