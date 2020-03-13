import { SignIn } from '../signIn'

export class SignInService {
  public getContinuousSignInDayCount(list: SignIn[]) {
    let dayToMillisecond = 1000 * 60 * 60 * 24
    let todayOfMillisecond = new Date().setHours(0, 0, 0, 0)

    let dayBegin = todayOfMillisecond
    let dayFinish = todayOfMillisecond + dayToMillisecond

    for (let index = 0; index < list.length; index++) {
      if (dayBegin < list[index].createAt && list[index].createAt < dayFinish && list[index].superReward == 0) {
        dayBegin -= dayToMillisecond
        dayFinish -= dayToMillisecond
      } else {
        return index
      }
    }
    return list.length
  }
}
