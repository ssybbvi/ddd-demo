
import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";


export interface ITenantConnectionStringProps{
    connectionString:string;
}

export class TenantConnectionString extends ValueObject<ITenantConnectionStringProps>{
    public static maxLength: number = 105;
    public static minLength: number = 2;

    get value ():string{
        return this.props.connectionString
    }

    private constructor(props: ITenantConnectionStringProps){
        super(props)
    }

    public static create(props:ITenantConnectionStringProps):Result<TenantConnectionString>{
       
        return Result.ok<TenantConnectionString>(new TenantConnectionString(props));
    }
}