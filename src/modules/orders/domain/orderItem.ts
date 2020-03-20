import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";

export interface OrderItemProps {
    name:string
    price:number
    image:string
    commodityId:string
  }


  export class OrderItem extends Entity<OrderItemProps> {

    get id (): UniqueEntityID {
        return this._id
    }
    
    get name():string{
        return this.props.name
    }

    get price():number{
        return this.props.price
    }

    get image():string{
        return this.props.image
    }

    get commodityId():string{
        return this.props.commodityId
    }

    private constructor (props: OrderItemProps, id?: UniqueEntityID) {
        super(props, id);
      }


    public static create (props: OrderItemProps, id?: UniqueEntityID): Result<OrderItem> {
        const nullGuard = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: 'name' },
            { argument: props.price, argumentName: 'price' },
            { argument: props.image, argumentName: 'image' },
            { argument: props.commodityId, argumentName: 'commodityId' },
          ]);
      
        if (!nullGuard.succeeded) {
        return Result.fail<OrderItem>(nullGuard.message);
        } 
        const isNew = !!id === false;
    
        const defaultProps: OrderItemProps = {
            ...props,
        }
    
        const orderItem = new OrderItem(defaultProps, id);
    
        return Result.ok<OrderItem>(orderItem);
    }
  }