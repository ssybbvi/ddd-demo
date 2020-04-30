import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { Bargain } from '../../../domain/bargain'
import { BargainMap } from '../../../mappers/bargainMap'
import { IBargainDto } from '../../../dtos/bargainDto'
import { GetBargainListUseCase } from './getBargainListUseCase'
import { GetBargainListDto } from './getBargainListDto'

export class GetBargainListController extends BaseController {
  private useCase: GetBargainListUseCase

  constructor(useCase: GetBargainListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetBargainListDto = req.query as GetBargainListDto

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {

          default:
            return this.fail(res, error.errorValue())
        }
      }

      const bargainList = result.value.getValue() as Bargain[]
      const bargainListDto = await BargainMap.toDtoList(bargainList)
      return this.ok<IBargainDto[]>(res, bargainListDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
