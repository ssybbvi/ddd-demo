

import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Result } from '../../../shared/core/Result'


export interface ITeamProps {
  userId: string
  integral: number
}

export class Team extends AggregateRoot<ITeamProps> {
  private constructor(props: ITeamProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get userId(): string {
    return this.props.userId
  }

  get integral(): number {
    return this.props.integral
  }


  public static create(props: ITeamProps, id?: UniqueEntityID): Result<Team> {

    let signIn = new Team(
      {
        ...props
      },
      id
    )

    return Result.ok<Team>(signIn)
  }
}
