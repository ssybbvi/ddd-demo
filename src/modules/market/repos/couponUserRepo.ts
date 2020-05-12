import { CouponUser } from "../domain/couponUser";

export interface ICouponUserRepo {
  save(couponUser: CouponUser): Promise<void>
  getById(_id: string): Promise<CouponUser>
  getByCouponIdWithUserIdAndUnused(userId: string, couponId: string): Promise<CouponUser>
  filter(): Promise<CouponUser[]>
}