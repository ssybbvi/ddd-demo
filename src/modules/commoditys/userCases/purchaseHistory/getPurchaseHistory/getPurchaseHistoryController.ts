import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { GetPurchaseHistoryUseCase } from './getPurchaseHistoryUseCase'
import { GetPurchaseHistoryDto } from './getPurchaseHistoryDto'
import { PurchaseHistory } from '../../../domain/purchaseHistory'
import { PurchaseHistoryMap } from '../../../mappers/purchaseHistoryMap'
import { PurchaseHistoryDto } from '../../../dtos/purchaseHistoryDto'



export class GetPurchaseHistoryController extends BaseController {
  private useCase: GetPurchaseHistoryUseCase

  constructor(useCase: GetPurchaseHistoryUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: any, res: express.Response): Promise<any> {
    const dto: GetPurchaseHistoryDto = {
      commodityId: req.params.commodityId
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
        const purchaseHistorys = useCaseValue.getValue() as PurchaseHistory[]
        const purchaseHistoryDtos = purchaseHistorys.map(item => PurchaseHistoryMap.toDTO(item))
        return this.ok<PurchaseHistoryDto[]>(res, purchaseHistoryDtos)
      }
    } catch (err) {
      return this.fail(res, err)
    }
  }
}