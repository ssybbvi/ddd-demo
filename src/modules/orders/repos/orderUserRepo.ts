import { OrderUser } from "../domain/orderUser";

export interface IOrderUserRepo {
  save(orderUser: OrderUser): Promise<void>
  getById(_id: string): Promise<OrderUser>
  exist(_id: string): Promise<boolean>
}
