import { IBaseIdDbModels } from "../../../shared/infra/database/baseIdDbModels";
import { ICancelInfoDbModel } from "./cancelInfoDbModel";
import { IPaymentInfoDbModel } from "./paymentInfoDbModel";
import { IDeliveryInfoDbModel } from "./deliveryInfoDbModel";
import { ICommodityItemDbModel } from "./commodityItemDbModel";

export interface OrderDbModel extends IBaseIdDbModels {
    _id: string
    userId: string
    createAt: number
    totalAmount: number
    remark: string
    code: string

    cancelInfo?: ICancelInfoDbModel
    paymentInfo?: IPaymentInfoDbModel
    deliveryInfo?: IDeliveryInfoDbModel

    commodityItems: ICommodityItemDbModel[]
}






