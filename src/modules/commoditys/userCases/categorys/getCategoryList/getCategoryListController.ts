import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetCategoryListUseCase } from './getCategoryListUseCase'
import { IGetCategoryListDto } from './getCategoryListDto'
import { CategoryMap } from '../../../mappers/categoryMap'
import { ICategoryDto } from '../../../dtos/categoryDto'

export class GetCategoryListController extends BaseController {
  private useCase: GetCategoryListUseCase

  constructor(useCase: GetCategoryListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IGetCategoryListDto = req.body

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const list = result.value.getValue()
        const listDto = await CategoryMap.toDtoList(list)
        return this.ok<ICategoryDto[]>(res, listDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
