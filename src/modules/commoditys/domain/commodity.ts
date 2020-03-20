import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { CommodityCreated } from './events/CommodityCreated'
import { CommodityPrice } from './commodityPrice'
import { CommodityName } from './commodityName'

export interface ICommodityProps {
  name: CommodityName
  price: CommodityPrice
  descrption: string
  images: string[]
  fakePrice: string
  sales: number
  restrictedPurchaseQuantity: number
  tags: string[]
}

export class Commodity extends AggregateRoot<ICommodityProps> {
  private constructor(props: ICommodityProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get name(): CommodityName {
    return this.props.name
  }

  get price(): CommodityPrice {
    return this.props.price
  }

  get descrption(): string {
    return this.props.descrption
  }

  get images(): string[] {
    return this.props.images
  }

  get fakePrice(): string {
    return this.props.fakePrice
  }

  get sales(): number {
    return this.props.sales
  }

  get tags(): string[] {
    return this.props.tags
  }

  get restrictedPurchaseQuantity(): number {
    return this.props.restrictedPurchaseQuantity
  }

  public updateName(name:CommodityName){
    this.props.name=name
  }

  public updatePrice  (price:CommodityPrice){
    this.props.price=price
  }

  public updateDescrption(descrption:string){
    this.props.descrption=descrption
  }

  public updateImages (images:string[]){
    this.props.images=images
  }

  public updateFakePrice(fakePrice:string){
    this.props.fakePrice=fakePrice
  }

  public updateTags(tags:string[]){
    this.props.tags=tags
  }

  public updateRestrictedPurchaseQuantity(restrictedPurchaseQuantity:number){
    return this.props.restrictedPurchaseQuantity=restrictedPurchaseQuantity
  }

  public sale():void{
    this.props.sales++
  }

  public withdraw():void{
    this.props.sales--
  }

  public static create(props: ICommodityProps, id?: UniqueEntityID): Result<Commodity> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '商品名称' },
      { argument: props.price, argumentName: '金额' },
      { argument: props.descrption, argumentName: '描述' },
      { argument: props.images, argumentName: '图片' },
      { argument: props.fakePrice, argumentName: '假价格' },
      { argument: props.sales, argumentName: '销量' },
      { argument: props.restrictedPurchaseQuantity, argumentName: '限购' }
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Commodity>(guardResult.message)
    }

    const defaultValues: ICommodityProps = {
      ...props,
      tags: props.tags ? props.tags :[]
    }

    const fund = new Commodity(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
      fund.addDomainEvent(new CommodityCreated(fund))
    }
    return Result.ok<Commodity>(fund)
  }
}
