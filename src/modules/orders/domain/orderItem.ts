import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result } from "../../../shared/core/Result";
import { Guard } from "../../../shared/core/Guard";
import { CommodityType } from "../../commoditys/domain/commodityType";

export interface OrderItemProps {
    name: string
    price: number
    image: string
    commodityId: string
    commodityType: CommodityType
}


export class OrderItem extends Entity<OrderItemProps> {

    get id(): UniqueEntityID {
        return this._id
    }

    get name(): string {
        return this.props.name
    }

    get price(): number {
        return this.props.price
    }

    get image(): string {
        return this.props.image
    }

    get commodityId(): string {
        return this.props.commodityId
    }

    get commodityType(): CommodityType {
        return this.props.commodityType
    }

    private constructor(props: OrderItemProps, id?: UniqueEntityID) {
        super(props, id);
    }


    public static create(props: OrderItemProps, id?: UniqueEntityID): Result<OrderItem> {
        const nullGuard = Guard.againstNullOrUndefinedBulk([
            { argument: props.name, argumentName: '商品名称' },
            { argument: props.price, argumentName: '商品价格' },
            { argument: props.commodityId, argumentName: '商品编号' },
            { argument: props.commodityType, argumentName: '商品类型' }
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