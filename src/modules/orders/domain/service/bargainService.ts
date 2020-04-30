
export class BargainService {

  public bargain(totalAmount: number, currentAmount: number, totalWeights: number, newWeights: number): number {
    newWeights = Math.min(newWeights, totalWeights)
    let bargainRate = this.bargainScheduleFunction(newWeights / totalWeights)//砍价进度
    const newCurrentAmount = Math.ceil(totalAmount - bargainRate * totalAmount)
    return currentAmount - newCurrentAmount
  }

  //幂函数  y=x^(1/4)  http://blog.sina.com.cn/s/blog_55954cfb0102e5x6.html 
  private bargainScheduleFunction(x: number) {
    return Math.pow(x, 1 / 5)
  }
}

