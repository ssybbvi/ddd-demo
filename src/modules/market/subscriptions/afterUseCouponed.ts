// import { IHandle } from '../../../shared/domain/events/IHandle'
// import { DomainEvents } from '../../../shared/domain/events/DomainEvents'
// import { UseCouponUserUseCase } from '../useCases/couponUser/useCouponUser/useCouponUserUseCase'
// import { UseCouponed } from '../domain/events/useCouponed'

// export class AfterUseCouponed implements IHandle<UseCouponed> {
//   private useCouponUserUseCase: UseCouponUserUseCase

//   constructor(useCouponUserUseCase: UseCouponUserUseCase) {
//     this.setupSubscriptions()
//     this.useCouponUserUseCase = useCouponUserUseCase
//   }

//   setupSubscriptions(): void {
//     // Register to the domain event
//     DomainEvents.register(
//       {
//         isNeedAwait: false,
//         domainEvenntFn: this.onAfterUseCouponed.bind(this),
//       },
//       UseCouponed.name
//     )
//   }

//   private async onAfterUseCouponed(event: UseCouponed): Promise<void> {
//     const { order } = event

//     try {
//       let result = await this.useCouponUserUseCase.execute({ userId: order.userId, couponId: order.couponId })
//       if (result.isLeft()) {
//         console.error(result.value)
//       }
//       console.log(`[UseCouponed]: 优惠券修改成已使用`)
//     } catch (err) {
//       console.log(`[UseCouponed]: 优惠券修改成已使用 ${err}`)
//     }
//   }
// }
