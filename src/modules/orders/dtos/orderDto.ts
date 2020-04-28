import { ICancelInfoDto } from "./cancelInfoDto";
import { IPaymentInfoDto } from "./paymentInfoDto";
import { IDeliveryInfoDto } from "./deliveryInfoDto";

export interface OrderDto {
    _id: string
    userId: string
    createAt: number
    totalAmount: number
    remark: string
    code: string

    cancelInfo?: ICancelInfoDto
    paymentInfo?: IPaymentInfoDto
    deliveryInfo?: IDeliveryInfoDto

    commodityItems: CommodityItemDto[]
}

export interface CommodityItemDto {
    _id: string
    name: string
    price: number
    image: string
    commodityId: string
}

