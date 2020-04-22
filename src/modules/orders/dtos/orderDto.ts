import { OrderItemDto } from "./orderItemDto";

export interface OrderDto {
    _id: string
    userId: string
    createAt: number
    status: string
    price: number
    remark: string
    code: string

    paymentTime?: number
    cancelTime?: number

    customerServiceCancelTime?: number
    customerServiceRemark?: string

    finishTime?: number

    closeTime?: number

    items: OrderItemDto[]
}