export interface IEditCommodityDto{
    _id:string
    name: string
    price: number
    descrption: string
    images: string[]
    fakePrice: string
    restrictedPurchaseQuantity: number
    tags: string[]
}