import { Bargain } from "../bargain";
import { RandomUtils } from "../../../../shared/utils/RandomUtils";

export class BargainService {

  public bargain(bargain: Bargain): number {
    const bargainPrice = RandomUtils.interval(bargain.price / 5, bargain.price / 3)
    return Math.min(bargainPrice, bargain.currentPrice);
  }

}

