export interface IBargainOrderDto {
  _id: string
  userId: string
  commodityId: string
  name: string,
  currentPrice: number
  price: number
  isSuccess: boolean
  createAt: number
  finishAt: number
  expiredAt: number
  participants: IParticipantsDto[]

  // userName: string
  // provinceName: string,
  // cityName: string,
  // countyName: string,
  // detailAddressInfo: string,
  // nationalCode: string,
  // telNumber: string
}

export interface IParticipantsDto {
  _id: string
  //bargainOrderId: string
  userId: string
  name: string
  price: number
  createAt: number
}