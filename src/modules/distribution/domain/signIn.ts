import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { SignInId } from './signInId'
import { SignInCreated } from './events/signInCreated'

export interface SignInProps {
  signInMemberId: string
  createAt: number
  reward: number
}

export class SignIn extends AggregateRoot<SignInProps> {
  private constructor(props: SignInProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get signInId(): SignInId {
    return SignInId.create(this._id).getValue()
  }

  get signInMemberId(): string {
    return this.props.signInMemberId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get reward(): number {
    return this.props.reward
  }

  public static create(props: SignInProps, id?: UniqueEntityID): Result<SignIn> {
    const isNew = !!id === false

    let signIn = new SignIn(
      {
        ...props,
        createAt: Date.now()
      },
      id
    )

    if (isNew) {
      signIn.addDomainEvent(new SignInCreated(signIn))
    }

    return Result.ok<SignIn>(signIn)
  }
}
