import { FundStatus } from "../../../domain/fundStatus";
import { FundType } from "../../../domain/fundType";

export interface FundStatusChangeDto {
  status: FundStatus
  type: FundType
  relationId: string
}