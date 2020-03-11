import { SignIn } from '../domain/signIn'

export interface ISignInRepo {
  filter(memberId: string, limit: number): Promise<SignIn[]>
  save(user: SignIn): Promise<void>
  getById(_id: string): Promise<SignIn>
  existToday(memberId: string): Promise<boolean>
  getToday(memberId: string): Promise<SignIn>
}
