import { CommodityTag } from '../domain/commodityTag'

export interface ICommodityTagRepo {
  save(commodity: CommodityTag): Promise<void>
  getById(_id: string): Promise<CommodityTag>
  existTag(tag: string): Promise<boolean>
  filter(): Promise<CommodityTag[]>

}
