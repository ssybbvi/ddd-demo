import { AggregateRoot } from "../../../shared/domain/AggregateRoot"
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID"
import { IGuardArgument, Guard } from "../../../shared/core/Guard"
import { Result } from "../../../shared/core/Result"
import { CryptoUtils } from "../../../shared/utils/CryptoUtils"
import { AuthCodeCreated } from "./events/authCodeCreated"
import uuid from 'uuid/v4';

export interface IAuthCodeProps {
  appId: string
  userId: string
  code?: string
  createAt?: number
  expiresIn?: number
}

const expiresInTime = 1000 * 4000;


export class AuthCode extends AggregateRoot<IAuthCodeProps>{
  private constructor(props: IAuthCodeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get appId(): string {
    return this.props.appId
  }

  get code(): string {
    return this.props.code
  }

  get userId(): string {
    return this.props.userId
  }

  get createAt(): number {
    return this.props.createAt
  }

  get expiresIn(): number {
    return this.props.expiresIn
  }

  public refreshExpiresIn() {
    this.props.code = uuid()
    this.props.expiresIn = expiresInTime
  }

  public static create(props: IAuthCodeProps, id?: UniqueEntityID): Result<AuthCode> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.appId, argumentName: '应用编号' },
      { argument: props.userId, argumentName: '用户编号' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<AuthCode>(guardResult.message)
    }

    const defaultValues: IAuthCodeProps = {
      ...props,
      code: props.code ? props.code : uuid(),
      expiresIn: props.expiresIn ? props.expiresIn : Date.now() + expiresInTime,
      createAt: props.createAt ? props.createAt : Date.now(),
    }

    const domainModel = new AuthCode(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
      domainModel.addDomainEvent(new AuthCodeCreated(domainModel))
    }
    return Result.ok<AuthCode>(domainModel)
  }
}