import { PurchaseHistory } from '../domain/purchaseHistory'

export interface IPurchaseHistoryRepo {
  save(commodity: PurchaseHistory): Promise<void>
  getById(_id: string): Promise<PurchaseHistory>
  exist(_id: string): Promise<boolean>
  filter(commodityId: string): Promise<PurchaseHistory[]>
}
