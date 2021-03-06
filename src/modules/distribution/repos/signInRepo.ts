import { SignIn } from '../domain/signIn'

export interface ISignInRepo {
  filter(recommendedUserId: string, limit: number): Promise<SignIn[]>
  save(signIn: SignIn): Promise<void>
  getById(_id: string): Promise<SignIn>
  existToday(recommendedUserId: string): Promise<boolean>
  getToday(recommendedUserId: string): Promise<SignIn>
  getCountByUserId(useId: string): Promise<number>
}
