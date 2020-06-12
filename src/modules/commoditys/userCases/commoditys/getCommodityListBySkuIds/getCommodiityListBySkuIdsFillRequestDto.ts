import { CommodityDto } from '../../../dtos/commodityDto'

export interface IGetCommodiityListBySkuIdsFillRequestDto extends CommodityDto {
  skuId: string
}
