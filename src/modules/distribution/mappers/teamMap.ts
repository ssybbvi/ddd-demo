import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Team } from '../domain/team'
import { ITeamDbModel } from '../dbModels/iTeamDbModel'
import { TeamDTO } from '../dtos/teamDTO'
import { userIdToDto } from '../../users/infra/decorators/wxUserDtoDecorators'

export class TeamMap implements IMapper<Team> {

  public static async toDtoList(teamList: Team[]): Promise<TeamDTO[]> {
    const list = []
    for (let item of teamList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  @userIdToDto()
  public static async toDTO(team: Team): Promise<TeamDTO> {
    return {
      userId: team.userId,
      integral: team.integral
    }
  }

  public static toDomain(raw: ITeamDbModel): Team {
    const teamOrError = Team.create(
      {
        userId: raw.userId,
        integral: raw.integral,
      },
      new UniqueEntityID(raw._id)
    )

    teamOrError.isFailure ? console.log(teamOrError.error) : ''

    return teamOrError.isSuccess ? teamOrError.getValue() : null
  }

  public static async toPersistence(team: Team): Promise<ITeamDbModel> {
    return {
      _id: team.id.toString(),
      userId: team.userId,
      integral: team.integral
    }
  }
}
