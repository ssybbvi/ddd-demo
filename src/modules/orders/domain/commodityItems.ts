import { WatchedList } from '../../../shared/domain/WatchedList'
import { CommodityItem } from './commodityItem'

export class CommodityItems extends WatchedList<CommodityItem> {
  private constructor(init: CommodityItem[]) {
    super(init)
  }

  public compareItems(a: CommodityItem, b: CommodityItem): boolean {
    return a.equals(b)
  }

  public static create(init?: CommodityItem[]): CommodityItems {
    return new CommodityItems(init ? init : [])
  }

  public getCommodityTotalAmount(): number {
    return this.getItems().reduce((acc, item) => (acc += item.amount), 0)
  }
}
