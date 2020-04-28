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
  commodityId: string
  name: string,
  price: number
  currentPrice?: number
  isSuccess?: boolean
  createAt?: number
  finishAt?: number
  expiredAt?: number
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

  get commodityId(): string {
    return this.props.commodityId
  }

  get name(): string {
    return this.props.name
  }

  get currentPrice(): number {
    return this.props.currentPrice
  }

  get price(): number {
    return this.props.price
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

  get participants(): Participants {
    return this.props.participants
  }

  get deliveryInfo(): DeliveryInfo {
    return this.props.deliveryInfo;
  }

  public bargain(userId: string): BargainResponse {
    if (this.isExpired()) {
      return left(new ExpiredError())
    }

    if (this.isSuccess) {
      return left(new IsFinishError())
    }

    const bargainPrice = bargainService.bargain(this)

    const participantOrError = Participant.create({
      userId: userId,
      name: "",
      price: bargainPrice,
    })

    if (participantOrError.isFailure) {
      return left(participantOrError)
    }

    const participant = participantOrError.getValue()

    this.props.participants.add(participant);
    this.props.currentPrice -= bargainPrice
    if (this.props.currentPrice === 0) {
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

  public static create(props: IBargainProps, id?: UniqueEntityID): Result<Bargain> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.commodityId, argumentName: 'commodityId' },
      { argument: props.price, argumentName: 'price' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Bargain>(nullGuard.message);
    }

    const domainModel = new Bargain(
      {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now(),
        currentPrice: props.currentPrice || props.currentPrice === 0 ? props.currentPrice : props.price,
        expiredAt: props.expiredAt ? props.expiredAt : Date.now() + 1000 * 60 * 60 * 24 * 2,
        participants: props.participants ? props.participants : Participants.create([])
      },
      id
    )

    const isNew = !!id === false
    if (isNew) {
      domainModel.addDomainEvent(new BargainCreated(domainModel))
    }

    return Result.ok<Bargain>(domainModel)
  }
}


