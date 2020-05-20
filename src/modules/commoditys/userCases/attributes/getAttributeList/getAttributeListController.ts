import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetAttributeListUseCase } from './getAttributeListUseCase'
import { IGetAttributeListDto } from './getAttributeListDto'
import { AttributeMap } from '../../../mappers/attributeMap'
import { IAttributeDto } from '../../../dtos/attributeDto'

export class GetAttributeListController extends BaseController {
  private useCase: GetAttributeListUseCase

  constructor(useCase: GetAttributeListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: IGetAttributeListDto = req.body

    try {
      const result = await this.useCase.execute(dto)

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      } else {
        const list = result.value.getValue()
        const listDto = await AttributeMap.toDtoList(list)
        return this.ok<IAttributeDto[]>(res, listDto)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
