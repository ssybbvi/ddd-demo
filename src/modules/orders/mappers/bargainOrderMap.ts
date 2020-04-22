import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { BargainOrder } from '../domain/bargainOrder'
import { IBargainOrderDto, IParticipantsDto } from '../dtos/bargainOrderDto'
import { IBargainOrderDbModel } from '../dbModels/bargainOrderDbModel'
import { Participants } from '../domain/participants'
import { Participant } from '../domain/participant'
import { OrderAddress } from '../domain/orderAddress'

export class BargainOrderMap implements IMapper<BargainOrder> {
  public static toDomain(raw: IBargainOrderDbModel): BargainOrder {
    if (raw === null) {
      return null
    }

    const orderAddressOrErrors = OrderAddress.create({
      userName: raw.userName,
      provinceName: raw.provinceName,
      cityName: raw.cityName,
      countyName: raw.countyName,
      detailAddressInfo: raw.detailAddressInfo,
      nationalCode: raw.nationalCode,
      telNumber: raw.telNumber,
    })
    orderAddressOrErrors.isFailure ? console.log(orderAddressOrErrors.error) : ''


    const participantList = raw.participants.map(item => {
      const participantOrErrors = Participant.create({
        bargainOrderId: item.bargainOrderId,
        userId: item.userId,
        name: item.name,
        price: item.price,
        createAt: item.createAt
      }, new UniqueEntityID(item._id))

      participantOrErrors.isFailure ? console.log(participantOrErrors.error) : '';

      return participantOrErrors.getValue()
    })


    const bargainOrderOrError = BargainOrder.create(
      {
        userId: raw.userId,
        commodityId: raw.commodityId,
        name: raw.name,
        currentPrice: raw.currentPrice,
        price: raw.price,
        isSuccess: raw.isSuccess,
        createAt: raw.createAt,
        finishAt: raw.finishAt,
        expiredAt: raw.expiredAt,
        participants: Participants.create(participantList),
        address: orderAddressOrErrors.getValue(),
      },
      new UniqueEntityID(raw._id)
    )
    bargainOrderOrError.isFailure ? console.log(bargainOrderOrError.error) : ''
    return bargainOrderOrError.isSuccess ? bargainOrderOrError.getValue() : null
  }

  public static toPersistence(bargainOrder: BargainOrder): IBargainOrderDbModel {

    const participants = bargainOrder.participants.getItems().map(item => {

      return {
        _id: item.participantId.toString(),
        bargainOrderId: item.bargainOrderId,
        userId: item.userId,
        name: item.name,
        price: item.price,
        createAt: item.createAt
      }
    })

    return {
      _id: bargainOrder.bargainOrderId.toString(),
      userId: bargainOrder.userId,
      commodityId: bargainOrder.commodityId,
      name: bargainOrder.name,
      currentPrice: bargainOrder.currentPrice,
      price: bargainOrder.price,
      isSuccess: bargainOrder.isSuccess,
      createAt: bargainOrder.createAt,
      finishAt: bargainOrder.finishAt,
      expiredAt: bargainOrder.expiredAt,
      participants: participants,

      userName: bargainOrder.address.userName,
      provinceName: bargainOrder.address.provinceName,
      cityName: bargainOrder.address.cityName,
      countyName: bargainOrder.address.countyName,
      detailAddressInfo: bargainOrder.address.detailAddressInfo,
      nationalCode: bargainOrder.address.nationalCode,
      telNumber: bargainOrder.address.telNumber,
    }
  }

  public static toDTO(bargainOrder: BargainOrder): IBargainOrderDto {

    const participantList = bargainOrder.participants.getItems().map<IParticipantsDto>(item => {
      return {
        _id: item.participantId,
        bargainOrderId: item.bargainOrderId,
        userId: item.userId,
        name: item.name,
        price: item.price,
        createAt: item.createAt
      }
    })

    return {
      _id: bargainOrder.bargainOrderId,
      userId: bargainOrder.userId,
      commodityId: bargainOrder.commodityId,
      name: bargainOrder.name,
      currentPrice: bargainOrder.currentPrice,
      price: bargainOrder.price,
      isSuccess: bargainOrder.isSuccess,
      createAt: bargainOrder.createAt,
      finishAt: bargainOrder.finishAt,
      expiredAt: bargainOrder.expiredAt,
      participants: participantList,

      // userName: bargainOrder.address.userName,
      // provinceName: bargainOrder.address.provinceName,
      // cityName: bargainOrder.address.cityName,
      // countyName: bargainOrder.address.countyName,
      // detailAddressInfo: bargainOrder.address.detailAddressInfo,
      // nationalCode: bargainOrder.address.nationalCode,
      // telNumber: bargainOrder.address.telNumber,
    }
  }
}
