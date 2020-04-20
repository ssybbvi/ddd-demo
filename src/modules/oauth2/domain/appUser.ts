import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { IGuardArgument, Guard } from "../../../shared/core/Guard";

export interface IAppUserProps {
  appId: string
  userId: string,
  openUserId: string
  createAt?: number
}


export class AppUser extends AggregateRoot<IAppUserProps>{

  private constructor(props: IAppUserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get appId(): string {
    return this.props.appId
  }

  get userId(): string {
    return this.props.userId
  }

  get openUserId(): string {
    return this.props.openUserId
  }

  get createAt(): number {
    return this.props.createAt
  }

  public static create(props: IAppUserProps, id?: UniqueEntityID): Result<AppUser> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.appId, argumentName: '应用编号' },
      { argument: props.userId, argumentName: '用户编号' },
      { argument: props.openUserId, argumentName: '用户公开编号' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<AppUser>(guardResult.message)
    }

    const defaultValues: IAppUserProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now(),
    }

    const domainModel = new AppUser(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
    }
    return Result.ok<AppUser>(domainModel)


  }
}