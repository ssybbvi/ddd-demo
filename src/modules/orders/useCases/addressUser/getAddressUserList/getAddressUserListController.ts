import { BaseController } from '../../../../../shared/infra/http/models/BaseController'
import * as express from 'express'
import { DecodedExpressRequest } from '../../../../users/infra/http/models/decodedRequest'
import { GetAddressUserListUseCase } from './getAddressUserListUseCase'
import { IGetAddressUserListDto } from './getAddressUserListDto'
import { AddressUser } from '../../../domain/addressUser'
import { AddressUserMap } from '../../../mappers/addressUserMap'
import { IAddressUserDto } from '../../../dtos/addressUserDto'

export class GetAddressUserListController extends BaseController {
  private useCase: GetAddressUserListUseCase

  constructor(useCase: GetAddressUserListUseCase) {
    super()
    this.useCase = useCase
  }

  async executeImpl(req: DecodedExpressRequest, res: express.Response): Promise<any> {
    const { userId } = req.decoded
    const dto: IGetAddressUserListDto = req.body as IGetAddressUserListDto
    dto.userId = userId

    try {
      const result = await this.useCase.execute(dto)
      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue())
      }

      const addressUserList = result.value.getValue() as AddressUser[]
      const addressUserListDto = await AddressUserMap.toDtoList(addressUserList)
      return this.ok<IAddressUserDto[]>(res, addressUserListDto)
    } catch (err) {
      return this.fail(res, err)
    }
  }
}
