import { DayDayTaskType } from "./dayDayTaskType";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { IGuardArgument, Guard } from "../../../shared/core/Guard";
import { DayDayTaskReceiveReward } from "./events/dayDayTaskReceiveReward";

interface IDayDayTaskProps {
  type: DayDayTaskType
  reward: number
  createAt?: number
  userId: string
  isReward: boolean
}


export class DayDayTask extends AggregateRoot<IDayDayTaskProps> {
  private constructor(props: IDayDayTaskProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get type(): DayDayTaskType {
    return this.props.type
  }

  get reward(): number {
    return this.props.reward
  }

  get createAt(): number {
    return this.props.createAt
  }

  get userId(): string {
    return this.props.userId
  }

  get isReward(): boolean {
    return this.props.isReward
  }

  public receiveReward(): void {
    this.props.isReward = true
    this.addDomainEvent(new DayDayTaskReceiveReward(this))
  }

  public static create(props: IDayDayTaskProps, id?: UniqueEntityID): Result<DayDayTask> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.type, argumentName: '任务类型' },
      { argument: props.reward, argumentName: '奖励' },
      { argument: props.userId, argumentName: '用户编号' },
      { argument: props.isReward, argumentName: '是否获取奖励' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<DayDayTask>(guardResult.message)
    }

    const defaultValues: IDayDayTaskProps = {
      ...props,
      createAt: props.createAt ? props.createAt : Date.now()
    }

    const fund = new DayDayTask(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
      //fund.addDomainEvent(new CommodityCreated(fund))
    }
    return Result.ok<DayDayTask>(fund)
  }
}