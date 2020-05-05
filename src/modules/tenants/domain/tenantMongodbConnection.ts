import { Result } from '../../../shared/core/Result'
import { ValueObject } from '../../../shared/domain/ValueObject'
import { Guard } from '../../../shared/core/Guard'

export interface ITenantMongodbConnectionProps {
  url: string
  dbName: string
}

export class TenantMongodbConnection extends ValueObject<ITenantMongodbConnectionProps> {
  public static maxLength: number = 105
  public static minLength: number = 2

  get url(): string {
    return this.props.url
  }

  get dbName(): string {
    return this.props.dbName
  }

  public static create(props: ITenantMongodbConnectionProps): Result<TenantMongodbConnection> {
    return Result.ok<TenantMongodbConnection>(new TenantMongodbConnection(props))
  }
}
