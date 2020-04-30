import { IMapper } from '../../../shared/infra/Mapper'
import { Participant } from '../domain/participant'
import { IParticipantDbModel } from '../dbModels/participantDbModel'
import { IParticipantDto } from '../dtos/participantDto'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { userIdToDto } from '../../users/infra/decorators/wxUserDtoDecorators'



export class ParticipantMap implements IMapper<Participant> {
  public static toDomain(raw: IParticipantDbModel): Participant {
    if (!raw) {
      return null
    }

    const participantOrError = Participant.create(
      {
        userId: raw.userId,
        amount: raw.amount,
        weights: raw.weights,
        createAt: raw.createAt
      }, new UniqueEntityID(raw._id)
    )
    participantOrError.isFailure ? console.log(participantOrError.error) : ''
    return participantOrError.isSuccess ? participantOrError.getValue() : null
  }

  public static toPersistence(participant: Participant): IParticipantDbModel {
    if (!participant) {
      return null
    }
    return {
      _id: participant.id,
      userId: participant.userId,
      amount: participant.amount,
      weights: participant.weights,
      createAt: participant.createAt
    }
  }

  public static async toDtoList(participantList: Participant[]) {
    const list = []
    for (let item of participantList) {
      list.push(await this.toDTO(item))
    }
    return list
  }


  @userIdToDto()
  public static async toDTO(participant: Participant): Promise<IParticipantDto> {
    if (!participant) {
      return null
    }
    return {
      _id: participant.id,
      userId: participant.userId,
      amount: participant.amount,
      createAt: participant.createAt
    }
  }
}
