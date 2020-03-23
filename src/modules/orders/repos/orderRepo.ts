import { Order } from "../domain/order";
import { OrderStatus } from "../domain/orderStatus";

export interface IOrderRepo {
    save(order: Order): Promise<void>
    getById(_id: string): Promise<Order>
    exist(_id: string): Promise<boolean>
    filter(orderStatus:OrderStatus|'',userId?:string): Promise<Order[]>
    cancelOrder(unpaidTime:number):Promise<void>
  }
  