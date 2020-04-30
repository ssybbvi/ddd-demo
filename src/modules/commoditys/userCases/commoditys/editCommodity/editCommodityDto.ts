export interface IEditCommodityDto {
    _id: string
    name: string
    amount: number
    description: string
    images: string[]
    fakeAmount: string
    restrictedPurchaseQuantity: number
    tags: string[]
    imgesDescrptionList: string[],
    type: string
}