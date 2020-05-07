import { IBaseIdDbModels } from "../../../shared/infra/database/dbModel/baseIdDbModels";
import { ITenantIdDbModel } from "../../../shared/infra/database/dbModel/tenantIdDbModel";

export interface ICommodityDbModel extends IBaseIdDbModels, ITenantIdDbModel {

  name: string
  amount: number
  description: string
  images: string[]
  fakeAmount: string
  sales: number
  restrictedPurchaseQuantity: number
  limitedPurchasePerPerson: number
  tags: string[]
  imgesDescrptionList: string[],
  type: string
}
