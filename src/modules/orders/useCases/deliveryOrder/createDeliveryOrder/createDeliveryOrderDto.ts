import { OrderAddress } from "../../../domain/orderAddress";

export interface CreateDeliveryOrderDto {
  orderId: string
  address: OrderAddress
}