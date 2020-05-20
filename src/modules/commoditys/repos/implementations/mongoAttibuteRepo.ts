import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { IAttributeRepo } from '../iAttributeRepo'
import { IAttributeDbModel } from '../../dbModels/attributeDbModel'
import { Attribute } from '../../domain/attribute'
import { AttributeMap } from '../../mappers/attributeMap'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoAttributeRepo implements IAttributeRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<IAttributeDbModel> {
    return MongodbWithTenant.instance.Collection<IAttributeDbModel>('attribute')
  }

  public async getById(_id: string): Promise<Attribute> {
    let attribute = await this.getCollection().findOne({ _id })
    return AttributeMap.toDomain(attribute)
  }

  public async save(attribute: Attribute): Promise<void> {
    const raw = await AttributeMap.toPersistence(attribute)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          categoryId: raw.categoryId,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(attribute)
  }

  public async exist(_id: string): Promise<boolean> {
    let attribute = await this.getCollection().findOne({ _id })
    return !!attribute === true
  }

  public async filter(): Promise<Attribute[]> {
    let attributeList = await this.getCollection().find({}).toArray()
    return attributeList.map((item) => AttributeMap.toDomain(item))
  }
}
