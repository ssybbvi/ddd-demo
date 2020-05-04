export interface IDeliveryInfoDto {
  beginAt?: number
  code?: string
  finishAt?: number
  type?: string
}

export interface IAddressInfoDto {
  userName: string
  provinceName: string
  cityName: string
  countyName: string
  detailAddressInfo: string
  nationalCode: string
  telNumber: string
}
