import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetOrderUserDto } from './getOrderUserDto'
import { GetOrderUserUseCase } from './getOrderUserUseCase'
import { OrderUser } from '../../../domain/orderUser'
import { OrderUserMap } from '../../../mappers/orderUserMap'
import { IOrderUserDto } from '../../../dtos/orderUserDto'



export class GetOrderUserController extends BaseController {
  private useCase: GetOrderUserUseCase

  constructor(useCase: GetOrderUserUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded;
    const dto: GetOrderUserDto = req.body as GetOrderUserDto
    dto.userId = userId


    try {
      const result = await this.useCase.execute(dto)
      let useCaseValue = result.value
      if (result.isLeft()) {
        const error = useCaseValue

        switch (error.constructor) {
          default:
            return this.fail(res, error.errorValue() + '')
        }
      }
      const orderUser = useCaseValue.getValue() as OrderUser
      const orderUserDto = OrderUserMap.toDTO(orderUser)
      return this.ok<IOrderUserDto>(res, orderUserDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
