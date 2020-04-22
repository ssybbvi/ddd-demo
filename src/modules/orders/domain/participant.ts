import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";

export interface IParticipantProps {
  bargainOrderId: string
  userId: string
  name: string
  price: number
  createAt?: number
}


export class Participant extends Entity<IParticipantProps> {

  get participantId(): string {
    return this._id.toString()
  }

  get bargainOrderId(): string {
    return this.props.bargainOrderId
  }

  get userId(): string {
    return this.props.userId
  }

  get name(): string {
    return this.props.name
  }

  get price(): number {
    return this.props.price
  }

  get createAt(): number {
    return this.props.createAt
  }


  public static create(props: IParticipantProps, id?: UniqueEntityID): Result<Participant> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.bargainOrderId, argumentName: 'bargainOrderId' },
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.price, argumentName: 'price' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Participant>(nullGuard.message);
    } else {

      const isNewParticipant = !!id === false;

      const defaultParticipantProps: IParticipantProps = {
        ...props,
        createAt: props.createAt ? props.createAt : Date.now()
      }

      const participant = new Participant(defaultParticipantProps, id);

      if (isNewParticipant) {

      }

      return Result.ok<Participant>(participant);
    }
  }
}