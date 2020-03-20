import { OrderStatus } from "./orderStatus";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
 
import { OrderAddress } from "./orderAddress";
import { OrderItem } from "./orderItem";
import { OrderCanceled } from "./events/orderCanceled";
import { OrderReceived } from "./events/orderReceived";
import { OrderPaymented } from "./events/orderPaymented";
import { OrderShipped } from "./events/orderShipped";
import { OrderCreated } from "./events/orderCreated";



export interface OrderProps {
    memberId:string
    createAt?:number
    status:OrderStatus
    price?:number
    remark?:string
    code?:string

    orderAddress:OrderAddress

    paymentTime?:number
    cancelTime?:number

    customerServiceCancelTime?:number
    customerServiceRemark?:string

    shippingTime?:number
    shippingNumber?:string
    shippingType?:string

    finishTime?:number

    items:OrderItem[]
  }


export class Order extends AggregateRoot<OrderProps>{
    private constructor(props: OrderProps, id?: UniqueEntityID) {
        super(props, id)
    }

    get memberId():string{
        return this.props.memberId
    }

    get createAt():number{
        return this.props.createAt
    }

    get status():OrderStatus{
        return this.props.status
    }

    get price():number{
        return this.props.price
    }

    get remark():string{
        return this.props.remark
    }

    get code():string{
        return this.props.code
    }



    get address():OrderAddress{
        return this.props.orderAddress
    }



    get paymentTime():number{
        return this.props.paymentTime
    }

    get cancelTime():number{
        return this.props.cancelTime
    }



    get customerServiceCancelTime():number{
        return this.props.customerServiceCancelTime
    }

    get customerServiceRemark():string{
        return this.props.customerServiceRemark
    }



    get shippingTime():number{
        return this.props.shippingTime
    }

    get shippingNumber():string{
        return this.props.shippingNumber
    }

    get shippingType():string{
        return this.props.shippingType
    }

 
    get finishTime():number{
        return this.props.finishTime
    }


    get orderItems():OrderItem[]{
        return this.props.items
    }

    public cancel(){
        this.props.cancelTime=Date.now()
        this.props.status='cancel'
        this.addDomainEvent(new OrderCanceled(this))
    }

    public payment (){
        this.props.paymentTime=Date.now()
        this.props.status='shipping'
        this.addDomainEvent(new OrderPaymented(this))
    }

    public shipped(shippingNumber:string,shippingType:string){
        this.props.shippingTime=Date.now()
        this.props.status='shipped'
        this.props.shippingNumber=shippingNumber
        this.props.shippingType=shippingType
        this.addDomainEvent(new OrderShipped(this))
    }

    public received(){
        this.props.finishTime=Date.now()
        this.props.status='received'
        this.addDomainEvent(new OrderReceived(this))
    }

    public isAllowPyamnet():boolean{
        const lastPaymentTime=Date.now()-1000* 60 *15
        return this.props.createAt>lastPaymentTime
    }

    public isUnPaid():boolean{
        return this.props.status==="unpaid"
    }

    private calculationOrderItemPriceTotal():void{
      this.props.price=this.orderItems.reduce((acc,item)=>acc+=item.price,0)
    }

    private createOrderCode():void{
        const  padZero=(num) =>num < 10? "0" + num: "" + num;

        const now = new Date();
        let code:string=  now.getFullYear()+''
        code+= padZero(now.getMonth() + 1)
        code+= padZero(now.getDate())
        code+= padZero(now.getHours())
        code+= padZero(now.getMinutes())
        code+= padZero(now.getSeconds())

        let randomLength=6
        let random=Math.floor(Math.random() * Math.pow(10,randomLength) )+''
        random.padStart(randomLength,'0')
        this.props.code=code+random
    }

    public static create(props: OrderProps, id?: UniqueEntityID): Result<Order> {
        const isNew= !!id === false
        const order = new Order(
        {
            ...props,
            createAt: props.createAt ? props.createAt : Date.now(),
            code:props.code ? props.code : "",
        },  id )

        order.calculationOrderItemPriceTotal()
        order.createOrderCode()


        if (isNew) {
            order.addDomainEvent(new OrderCreated(order))
        }

        return Result.ok<Order>(order)
      }

  }
