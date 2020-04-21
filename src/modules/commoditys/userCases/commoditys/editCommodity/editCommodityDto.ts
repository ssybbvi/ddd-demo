export interface IEditCommodityDto {
    _id: string
    name: string
    price: number
    description: string
    images: string[]
    fakePrice: string
    restrictedPurchaseQuantity: number
    tags: string[]
    imgesDescrptionList: string[],
    type: string
}