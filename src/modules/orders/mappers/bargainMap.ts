import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { Bargain } from '../domain/bargain'
import { IBargainDto } from '../dtos/bargainDto'
import { IBargainDbModel } from '../dbModels/bargainDbModel'
import { Participants } from '../domain/participants'
import { DeliveryInfoMap } from './deliveryInfoMap'
import { ParticipantMap } from './participantMap'
import { CommodityItemMap } from './commodityItemMap'
import { CommodityItems } from '../domain/commodityItems'

export class BargainMap implements IMapper<Bargain> {
  public static toDomain(raw: IBargainDbModel): Bargain {
    if (!raw) {
      return null
    }

    const participantList = raw.participants.map(item => ParticipantMap.toDomain(item))
    const commodityItems = raw.commodityItems.map(item => CommodityItemMap.toDomain(item))
    const bargainOrError = Bargain.create(
      {
        userId: raw.userId,
        amount: raw.amount,
        currentAmount: raw.currentAmount,
        isSuccess: raw.isSuccess,
        createAt: raw.createAt,
        finishAt: raw.finishAt,
        expiredAt: raw.expiredAt,
        commodityItems: CommodityItems.create(commodityItems),
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

    const commodityItems = bargain.commodityItems.getItems().map(item => CommodityItemMap.toPersistence(item))
    const participants = bargain.participants.getItems().map(item => ParticipantMap.toPersistence(item))
    const deliveryInfoDbModel = DeliveryInfoMap.toPersistence(bargain.deliveryInfo)

    return {
      _id: bargain.bargainId.toString(),
      userId: bargain.userId,
      currentAmount: bargain.currentAmount,
      amount: bargain.amount,
      isSuccess: bargain.isSuccess,
      createAt: bargain.createAt,
      finishAt: bargain.finishAt,
      expiredAt: bargain.expiredAt,
      commodityItems: commodityItems,
      participants: participants,
      deliveryInfo: deliveryInfoDbModel
    }
  }

  public static async toDtoList(bargainList: Bargain[]) {
    const list = []
    for (let item of bargainList) {
      list.push(await this.toDTO(item))
    }
    return list
  }

  public static async toDTO(bargain: Bargain): Promise<IBargainDto> {
    if (!bargain) {
      return null
    }

    const commodityItems = await CommodityItemMap.toListDto(bargain.commodityItems.getItems())
    const participantList = await ParticipantMap.toDtoList(bargain.participants.getItems())
    const deliveryInfoDto = DeliveryInfoMap.toDTO(bargain.deliveryInfo)

    return {
      _id: bargain.bargainId,
      userId: bargain.userId,
      currentAmount: bargain.currentAmount,
      amount: bargain.amount,
      isSuccess: bargain.isSuccess,
      createAt: bargain.createAt,
      finishAt: bargain.finishAt,
      expiredAt: bargain.expiredAt,
      commodityItems: commodityItems,
      participants: participantList,
      deliveryInfo: deliveryInfoDto
    }
  }
}
