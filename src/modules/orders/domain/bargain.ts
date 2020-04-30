import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result, Either, left, right } from "../../../shared/core/Result";
import { Participants } from "./participants";
import { Participant } from "./participant";
import { Guard } from "../../../shared/core/Guard";
import { BargainCreated } from "./events/bargainCreated";
import { AppError } from "../../../shared/core/AppError";
import { bargainService } from "./service";
import { BargainSeccessed } from "./events/bargainSeccessed";
import { DeliveryInfo, RepeatShipmentError, NotShippingError } from "./deliveryInfo";
import { UseCaseError } from "../../../shared/core/UseCaseError";
import { CommodityItems } from "./commodityItems";

type BargainResponse = Either<
  ExpiredError | IsFinishError |
  AppError.UnexpectedError, Result<void>>

export class ExpiredError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `砍价活动已过期`
    } as UseCaseError)
  }
}

export class IsFinishError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `砍价活动已结束`
    } as UseCaseError)
  }
}

export class NotSeccessError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `活动未成功`
    } as UseCaseError)
  }
}



interface IBargainProps {
  userId: string
  amount?: number
  currentAmount?: number
  isSuccess?: boolean
  createAt?: number
  finishAt?: number
  expiredAt?: number
  commodityItems: CommodityItems
  participants?: Participants
  deliveryInfo: DeliveryInfo
}

export class Bargain extends AggregateRoot<IBargainProps> {
  private constructor(props: IBargainProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get bargainId(): string {
    return this._id.toString()
  }

  get userId(): string {
    return this.props.userId
  }


  get currentAmount(): number {
    return this.props.currentAmount
  }

  get amount(): number {
    return this.props.amount
  }

  get isSuccess(): boolean {
    return this.props.isSuccess
  }

  get createAt(): number {
    return this.props.createAt
  }

  get finishAt(): number {
    return this.props.finishAt
  }

  get expiredAt(): number {
    return this.props.expiredAt
  }

  get commodityItems(): CommodityItems {
    return this.props.commodityItems
  }

  get participants(): Participants {
    return this.props.participants
  }

  get deliveryInfo(): DeliveryInfo {
    return this.props.deliveryInfo;
  }

  public bargain(userId: string, weights: number): BargainResponse {
    if (this.isExpired()) {
      return left(new ExpiredError())
    }

    if (this.isSuccess) {
      return left(new IsFinishError())
    }
    const newWeights = this.participants.getItems().reduce((acc, item) => acc += item.weights, 0) + weights //目前权重
    const totalWeights = this.amount / 100
    const bargainAmount = bargainService.bargain(this.amount, this.currentAmount, totalWeights, newWeights)

    const participantOrError = Participant.create({
      userId: userId,
      amount: bargainAmount,
      weights: weights
    })

    if (participantOrError.isFailure) {
      return left(participantOrError)
    }

    const participant = participantOrError.getValue()

    this.props.participants.add(participant);
    this.props.currentAmount -= bargainAmount
    if (this.props.currentAmount === 0) {
      this.props.isSuccess = true
      this.props.finishAt = Date.now()
      this.addDomainEvent(new BargainSeccessed(this))
    }
    return right(Result.ok<void>())
  }

  public shipped(code: string, type: string): Either<NotSeccessError | RepeatShipmentError, Result<void>> {
    if (!this.props.isSuccess) {
      return left(new NotSeccessError())
    }
    const shippedResult = this.deliveryInfo.shipped(code, type)
    if (shippedResult.isLeft()) {
      return left(shippedResult.value)
    }
    return right(Result.ok<void>())
  }

  public received(): Either<NotShippingError, Result<void>> {
    const shippedResult = this.deliveryInfo.received()
    if (shippedResult.isLeft()) {
      return left(shippedResult.value)
    }
    return right(Result.ok<void>())
  }

  public isExpired(): boolean {
    return this.props.expiredAt < Date.now()
  }

  public isHasParticipants(userId: string): boolean {
    return this.props.participants.getItems().some(item => item.userId === userId)
  }

  private calculationCommodityItemAmountTotal(): void {
    this.props.amount = this.commodityItems.getItems().reduce((acc, item) => (acc += item.amount), 0)
    this.props.currentAmount = this.props.amount
  }


  public static create(props: IBargainProps, id?: UniqueEntityID): Result<Bargain> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.commodityItems, argumentName: 'commodityItems' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Bargain>(nullGuard.message);
    }

    const domainModel = new Bargain(
      {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now(),
        expiredAt: props.expiredAt ? props.expiredAt : Date.now() + 1000 * 60 * 60 * 24 * 2,
        participants: props.participants ? props.participants : Participants.create([])
      },
      id
    )
    domainModel.calculationCommodityItemAmountTotal()

    const isNew = !!id === false
    if (isNew) {
      domainModel.addDomainEvent(new BargainCreated(domainModel))
    }

    return Result.ok<Bargain>(domainModel)
  }
}


