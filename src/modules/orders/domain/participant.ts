import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";

export interface IParticipantProps {
  userId: string
  name: string
  price: number
  weights: number
  createAt?: number
}


export class Participant extends Entity<IParticipantProps> {
  get id(): string {
    return this._id.toString()
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

  get weights(): number {
    return this.props.weights
  }

  get createAt(): number {
    return this.props.createAt
  }


  public static create(props: IParticipantProps, id?: UniqueEntityID): Result<Participant> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: '用户编号' },
      { argument: props.name, argumentName: '姓名' },
      { argument: props.price, argumentName: '砍价' },
      { argument: props.weights, argumentName: '权重' },
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