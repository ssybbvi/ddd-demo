import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result, Either, left, right } from "../../../shared/core/Result";
import { Participants } from "./participants";
import { Participant } from "./participant";
import { Guard } from "../../../shared/core/Guard";
import { OrderAddress } from "./orderAddress";
import { BargainOrderCreated } from "./events/bargainOrderCreated";
import { AppError } from "../../../shared/core/AppError";
import { bargainService } from "./service";

type BargainResponse = Either<AppError.UnexpectedError, Result<void>>


interface IBargainOrderProps {
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

  address: OrderAddress
}

export class BargainOrder extends AggregateRoot<IBargainOrderProps> {
  private constructor(props: IBargainOrderProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get bargainOrderId(): string {
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

  get address(): OrderAddress {
    return this.props.address
  }

  public bargain(userId: string): BargainResponse {

    const bargainPrice = bargainService.bargain(this)

    const participantOrError = Participant.create({
      bargainOrderId: this.bargainOrderId,
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

    return right(Result.ok<void>())
  }


  public isExpired(): boolean {
    return this.props.expiredAt < Date.now()
  }

  public isHasParticipants(userId: string): boolean {
    return this.props.participants.getItems().some(item => item.userId === userId)
  }

  public static create(props: IBargainOrderProps, id?: UniqueEntityID): Result<BargainOrder> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.commodityId, argumentName: 'commodityId' },
      { argument: props.price, argumentName: 'price' },
      { argument: props.address, argumentName: 'address' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<BargainOrder>(nullGuard.message);
    }

    const domainModel = new BargainOrder(
      {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now(),
        currentPrice: props.currentPrice ? props.currentPrice : props.price,
        expiredAt: props.expiredAt ? props.expiredAt : Date.now() + 1000 * 60 * 60 * 24 * 2,
        participants: props.participants ? props.participants : Participants.create([])
      },
      id
    )

    const isNew = !!id === false
    if (isNew) {
      domainModel.addDomainEvent(new BargainOrderCreated(domainModel))
    }

    return Result.ok<BargainOrder>(domainModel)
  }
}
