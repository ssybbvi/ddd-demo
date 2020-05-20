import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetSpecificationListUseCase } from './getSpecificationListUseCase'
import { IGetSpecificationListDto } from './getSpecificationListDto'
import { SpecificationMap } from '../../../mappers/specificationMap'
import { ISpecificationDto } from '../../../dtos/specificationDto'

export class GetSpecificationListController extends BaseController {
  private useCase: GetSpecificationListUseCase

  constructor(useCase: GetSpecificationListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IGetSpecificationListDto = req.body

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const list = result.value.getValue()
        const listDto = await SpecificationMap.toDtoList(list)
        return this.ok<ISpecificationDto[]>(res, listDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
