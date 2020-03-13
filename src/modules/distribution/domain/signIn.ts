import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'
import { SignInId } from './signInId'
import { SignInCreated } from './events/signInCreated'
import { SignInSuperRewared } from './events/signInSuperRewared'

export interface SignInProps {
  memberId: string
  createAt?: number
  reward: number
  superReward: number
}

export class SignIn extends AggregateRoot<SignInProps> {
  private constructor(props: SignInProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get signInId(): SignInId {
    return SignInId.create(this._id).getValue()
  }

  get memberId(): string {
    return this.props.memberId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get reward(): number {
    return this.props.reward
  }

  get superReward(): number {
    return this.props.superReward
  }

  public updateSuperReward(reward: number): void {
    this.props.superReward = reward
    this.addDomainEvent(new SignInSuperRewared(this))
  }

  public static create(props: SignInProps, id?: UniqueEntityID): Result<SignIn> {
    const isNew = !!id === false

    let signIn = new SignIn(
      {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now()
      },
      id
    )

    if (isNew) {
      signIn.addDomainEvent(new SignInCreated(signIn))
    }

    return Result.ok<SignIn>(signIn)
  }
}
