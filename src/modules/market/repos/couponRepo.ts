import { Coupon } from "../domain/coupon";

export interface ICouponRepo {
  save(coupon: Coupon): Promise<void>
  getById(_id: string): Promise<Coupon>
  filter(): Promise<Coupon[]>
}