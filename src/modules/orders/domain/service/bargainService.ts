import { BargainOrder } from "../bargainOrder";
import { RandomUtils } from "../../../../shared/utils/RandomUtils";

export class BargainService {

  public bargain(bargainOrder: BargainOrder): number {
    const remainingPrice = bargainOrder.price - bargainOrder.currentPrice
    const bargainPrice = RandomUtils.interval(bargainOrder.price / 5, bargainOrder.price / 3)
    return Math.min(bargainPrice, remainingPrice);
  }

}

