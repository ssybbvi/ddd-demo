export interface IDeliveryOrderDto {
  _id: string
  orderId: string
  beginAt?: number
  code?: string
  finishAt?: number
  deliveryType?: string

  userName: string,
  provinceName: string,
  cityName: string,
  countyName: string,
  detailAddressInfo: string,
  nationalCode: string,
  telNumber: string
}