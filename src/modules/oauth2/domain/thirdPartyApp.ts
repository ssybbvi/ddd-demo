import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Result } from '../../../shared/core/Result';
import { IGuardArgument, Guard } from '../../../shared/core/Guard';
import uuid from 'uuid/v4';
export interface IThirdPartyAppProps {
  name: string,
  appId: string
  secret: string
  accessToken?: string
  expiresIn?: number
  createAt?: number
}


export class ThirdPartyApp extends AggregateRoot<IThirdPartyAppProps>{

  private constructor(props: IThirdPartyAppProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): string {
    return this.props.name
  }

  get appId(): string {
    return this.props.appId
  }

  get secret(): string {
    return this.props.secret
  }

  get createAt(): number {
    return this.props.createAt
  }

  get accessToken(): string {
    return this.props.accessToken
  }

  get expiresIn(): number {
    return this.props.expiresIn
  }

  public login() {
    this.props.accessToken = uuid()
    this.props.expiresIn = 1000 //TODO
  }

  public static create(props: IThirdPartyAppProps, id?: UniqueEntityID): Result<ThirdPartyApp> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: 'xxx' },
      { argument: props.appId, argumentName: 'xxx' },
      { argument: props.secret, argumentName: 'xxx' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<ThirdPartyApp>(guardResult.message)
    }

    const defaultValues: IThirdPartyAppProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now(),
    }

    const domainModel = new ThirdPartyApp(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<ThirdPartyApp>(domainModel)
  }
}