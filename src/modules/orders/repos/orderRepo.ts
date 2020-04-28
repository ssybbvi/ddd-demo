import { Order } from "../domain/order";

export interface IOrderRepo {
  save(order: Order): Promise<void>
  getById(_id: string): Promise<Order>
  exist(_id: string): Promise<boolean>
  filter(userId?: string): Promise<Order[]>
  cancelOrder(unpaidTime: number): Promise<void>
}
