import { SignInDTO } from '../../../dtos/signInDTO'

export interface GetRecentSignInDtoResult {
  continuousSignInDayCount: number
  isAllowSuperSignIn: boolean
}
