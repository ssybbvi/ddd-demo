import { AggregateRoot } from '../../../shared/domain/AggregateRoot'
import { Result } from '../../../shared/core/Result'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { IGuardArgument, Guard } from '../../../shared/core/Guard'
import { CommodityCreated } from './events/CommodityCreated'
import { CommodityPrice } from './commodityPrice'
import { CommodityName } from './commodityName'
import { CommodityType } from './commodityType'

export interface ICommodityProps {
  name: CommodityName
  price: CommodityPrice
  description: string
  images: string[]
  fakePrice: string
  sales: number
  restrictedPurchaseQuantity: number//每次限购
  limitedPurchasePerPerson: number//每人限购
  tags: string[]
  imgesDescrptionList: string[],
  type: CommodityType
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

  get description(): string {
    return this.props.description
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

  get limitedPurchasePerPerson(): number {
    return this.props.limitedPurchasePerPerson
  }

  get imgesDescrptionList(): string[] {
    return this.props.imgesDescrptionList
  }

  get type(): CommodityType {
    return this.props.type
  }

  public updateName(name: CommodityName) {
    this.props.name = name
  }

  public updatePrice(price: CommodityPrice) {
    this.props.price = price
  }

  public updateDescrption(description: string) {
    this.props.description = description
  }

  public updateImages(images: string[]) {
    this.props.images = images
  }

  public updateFakePrice(fakePrice: string) {
    this.props.fakePrice = fakePrice
  }

  public updateTags(tags: string[]) {
    this.props.tags = tags
  }

  public updateRestrictedPurchaseQuantity(restrictedPurchaseQuantity: number) {
    this.props.restrictedPurchaseQuantity = restrictedPurchaseQuantity
  }

  public updateImgesDescrptionList(imgesDescrptionList: string[]) {
    this.props.imgesDescrptionList = imgesDescrptionList
  }

  public updateLimitedPurchasePerPerson(limitedPurchasePerPerson: number) {
    this.props.limitedPurchasePerPerson = limitedPurchasePerPerson
  }

  public updateType(type: CommodityType) {
    this.props.type = type
  }

  public sale(): void {
    this.props.sales++
  }

  public withdraw(): void {
    this.props.sales--
  }

  public isBargain(): boolean {
    return this.props.type === 'bargain'
  }

  public static create(props: ICommodityProps, id?: UniqueEntityID): Result<Commodity> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.name, argumentName: '商品名称' },
      { argument: props.price, argumentName: '金额' },
      { argument: props.description, argumentName: '描述' },
      { argument: props.images, argumentName: '图片' },
      { argument: props.fakePrice, argumentName: '假价格' },
      { argument: props.sales, argumentName: '销量' },
      { argument: props.restrictedPurchaseQuantity, argumentName: '每次限购' },
    ]

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs)

    if (!guardResult.succeeded) {
      return Result.fail<Commodity>(guardResult.message)
    }

    const defaultValues: ICommodityProps = {
      ...props,
      tags: props.tags ? props.tags : [],
      limitedPurchasePerPerson: props.limitedPurchasePerPerson ? props.limitedPurchasePerPerson : -1,
      type: props.type ? props.type : 'ordinary'
    }

    const commodity = new Commodity(defaultValues, id)

    const isNew = !!id === false
    if (isNew) {
      commodity.addDomainEvent(new CommodityCreated(commodity))
    }
    return Result.ok<Commodity>(commodity)
  }
}
