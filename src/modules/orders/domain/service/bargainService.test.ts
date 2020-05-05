import { bargainService } from '.'

test('砍价算法：createThirdPartyAppUseCase', () => {
  let amount = 1200 //总积分
  let bargainAmount = 0 //
  let currnetAmount = amount
  let weights = 1
  let totalWeights = amount / 100
  let bargainAmountList = []
  while (currnetAmount > 0) {
    bargainAmount = bargainService.bargain(amount, currnetAmount, totalWeights, weights)
    bargainAmountList.push(bargainAmount)
    currnetAmount -= bargainAmount
    weights += 1
  }
  console.log(bargainAmountList)
})
