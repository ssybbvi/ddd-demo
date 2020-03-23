export interface CreateOrderDto{
    userId:string
    remark:string

    userName:string
    provinceName : string,
    cityName : string,
    countyName : string,
    detailAddressInfo : string,
    nationalCode : string,
    telNumber :string

    items:CreateOrderItemDto[]
}

export interface CreateOrderItemDto{
    commodityId:string
}