import { OrderItemDto } from "./orderItemDto";

export interface OrderDto{
    _id:string
    memberId:string
    createAt:number
    status:string
    price:number
    remark:string
    code:string

    userName:string,
    provinceName : string,
    cityName : string,
    countyName : string,
    detailAddressInfo : string,
    nationalCode : string,
    telNumber :string

    paymentTime?:number
    cancelTime?:number

    customerServiceCancelTime?:number
    customerServiceRemark?:string

    shippingTime?:number
    shippingNumber?:string
    shippingType?:string

    finishTime?:number

    items:OrderItemDto[]
}