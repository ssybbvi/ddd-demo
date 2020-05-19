import { couponCache } from '../cache'

function couponIdToDto(key: string = 'couponId') {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let oldFunc = descriptor.value
    descriptor.value = async function (...args: any[]) {
      var result = await oldFunc.apply(this, args)
      try {
        let couponId = result[key]
        let userDto = await couponCache.getValue(couponId)
        let { name, condition, reward, receiveLimit, userReceiveLimit } = userDto
        return {
          couponName: name,
          couponCondition: condition,
          couponReward: reward,
          couponReceiveLimit: receiveLimit,
          couponUserReceiveLimit: userReceiveLimit,
          ...result,
        }
      } catch (err) {
        console.log('couponIdToCouponDto', err)
        return result
      }
    }
  }
}

export { couponIdToDto }
