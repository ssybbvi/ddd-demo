import { DeliveryOrder } from "../domain/deliveryOrder";

export interface IDeliveryOrderRepo {
  save(orderUser: DeliveryOrder): Promise<void>
  getById(_id: string): Promise<DeliveryOrder>
  exist(_id: string): Promise<boolean>
}
