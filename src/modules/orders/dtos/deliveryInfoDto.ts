export interface IDeliveryInfoDto {
  beginAt?: number
  code?: string
  finishAt?: number
  type?: string
  address: IOrderAddressDto
}

export interface IOrderAddressDto {
  userName: string,
  provinceName: string,
  cityName: string,
  countyName: string,
  detailAddressInfo: string,
  nationalCode: string,
  telNumber: string
}
