export interface OrderDbModel {
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

    items: OrderItemDbModel[]
}

export interface OrderItemDbModel {
    _id: string
    name: string
    price: number
    image: string
    commodityId: string,
    commodityType: string
}