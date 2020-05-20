import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { ISpecificationRepo } from '../iSpecificationRepo'
import { ISpecificationDbModel } from '../../dbModels/specificationDbModel'
import { Specification } from '../../domain/specification'
import { SpecificationMap } from '../../mappers/specificationMap'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoSpecificationRepo implements ISpecificationRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<ISpecificationDbModel> {
    return MongodbWithTenant.instance.Collection<ISpecificationDbModel>('specification')
  }

  public async getById(_id: string): Promise<Specification> {
    let specification = await this.getCollection().findOne({ _id })
    return SpecificationMap.toDomain(specification)
  }

  public async save(specification: Specification): Promise<void> {
    const raw = await SpecificationMap.toPersistence(specification)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          attributeId: raw.attributeId,
          icon: raw.icon,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(specification)
  }

  public async exist(_id: string): Promise<boolean> {
    let specification = await this.getCollection().findOne({ _id })
    return !!specification === true
  }

  public async filter(): Promise<Specification[]> {
    let specificationList = await this.getCollection().find({}).toArray()
    return specificationList.map((item) => SpecificationMap.toDomain(item))
  }
}
