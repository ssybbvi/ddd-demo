import { BargainOrder } from "../domain/bargainOrder";

export interface IBargainOrderRepo {
  save(orderUser: BargainOrder): Promise<void>
  getById(_id: string): Promise<BargainOrder>
  exist(_id: string): Promise<boolean>
  filter(): Promise<BargainOrder[]>
}
