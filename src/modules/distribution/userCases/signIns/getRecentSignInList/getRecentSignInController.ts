import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetRecentSignInUseCase } from './getRecentSignInUseCase'
import { GetRecentSignInDto } from './getRecentSignInDto'
import { SignInDTO } from '../../../dtos/signInDTO'
import { GetRecentSignInDtoResult } from './getRecentSignInDtoResult'
import { SignInMap } from '../../../mappers/signInMap'
import { SignIn } from '../../../domain/signIn'

export class GetRecentSignInController extends BaseController {
  private useCase: GetRecentSignInUseCase

  constructor(useCase: GetRecentSignInUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded

    const dto: GetRecentSignInDto = {
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
        const signInList: SignIn[] = useCaseValue.getValue() as SignIn[]
        let signInDtoList = signInList.map(item => SignInMap.toDTO(item))
        return this.ok<GetRecentSignInDtoResult>(res, {
          signIns: signInDtoList
        })
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
