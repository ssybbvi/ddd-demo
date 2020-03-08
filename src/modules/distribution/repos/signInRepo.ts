import { SignIn } from '../domain/signIn'

export interface ISignInRepo {
  filter(): Promise<SignIn[]>
  save(user: SignIn): Promise<void>
  getById(_id: string): Promise<SignIn>
}
