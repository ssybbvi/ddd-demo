import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Bargain } from '../domain/bargain'
import { IBargainDto, IParticipantsDto } from '../dtos/bargainDto'
import { IBargainDbModel } from '../dbModels/bargainDbModel'
import { Participants } from '../domain/participants'
import { Participant } from '../domain/participant'
import { DeliveryInfoMap } from './deliveryInfoMap'

export class BargainMap implements IMapper<Bargain> {
  public static toDomain(raw: IBargainDbModel): Bargain {
    if (!raw) {
      return null
    }

    const participantList = raw.participants.map(item => {
      const participantOrErrors = Participant.create({
        userId: item.userId,
        name: item.name,
        price: item.price,
        createAt: item.createAt
      }, new UniqueEntityID(item._id))

      participantOrErrors.isFailure ? console.log(participantOrErrors.error) : '';
      return participantOrErrors.getValue()
    })

    const bargainOrError = Bargain.create(
      {
        userId: raw.userId,
        commodityId: raw.commodityId,
        name: raw.name,
        price: raw.price,
        currentPrice: raw.currentPrice,
        isSuccess: raw.isSuccess,
        createAt: raw.createAt,
        finishAt: raw.finishAt,
        expiredAt: raw.expiredAt,
        participants: Participants.create(participantList),
        deliveryInfo: DeliveryInfoMap.toDomain(raw.deliveryInfo)
      },
      new UniqueEntityID(raw._id)
    )
    bargainOrError.isFailure ? console.log(bargainOrError.error) : ''
    return bargainOrError.isSuccess ? bargainOrError.getValue() : null
  }

  public static toPersistence(bargain: Bargain): IBargainDbModel {
    if (!bargain) {
      return null
    }
    const participants = bargain.participants.getItems().map(item => {
      return {
        _id: item.id,
        userId: item.userId,
        name: item.name,
        price: item.price,
        createAt: item.createAt
      }
    })

    const deliveryInfoDbModel = DeliveryInfoMap.toPersistence(bargain.deliveryInfo)

    return {
      _id: bargain.bargainId.toString(),
      userId: bargain.userId,
      commodityId: bargain.commodityId,
      name: bargain.name,
      currentPrice: bargain.currentPrice,
      price: bargain.price,
      isSuccess: bargain.isSuccess,
      createAt: bargain.createAt,
      finishAt: bargain.finishAt,
      expiredAt: bargain.expiredAt,
      participants: participants,
      deliveryInfo: deliveryInfoDbModel
    }
  }

  public static toDTO(bargain: Bargain): IBargainDto {
    if (!bargain) {
      return null
    }
    const participantList = bargain.participants.getItems().map<IParticipantsDto>(item => {
      return {
        _id: item.id,
        userId: item.userId,
        name: item.name,
        price: item.price,
        createAt: item.createAt
      }
    })

    const deliveryInfoDto = DeliveryInfoMap.toDTO(bargain.deliveryInfo)

    return {
      _id: bargain.bargainId,
      userId: bargain.userId,
      commodityId: bargain.commodityId,
      name: bargain.name,
      currentPrice: bargain.currentPrice,
      price: bargain.price,
      isSuccess: bargain.isSuccess,
      createAt: bargain.createAt,
      finishAt: bargain.finishAt,
      expiredAt: bargain.expiredAt,
      participants: participantList,
      deliveryInfo: deliveryInfoDto
    }
  }
}
