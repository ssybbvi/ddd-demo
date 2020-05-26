import { DomainEvents } from '../../../../shared/domain/events/DomainEvents'
import { ICategoryRepo } from '../iCategoryRepo'
import { ICategoryDbModel } from '../../dbModels/categoryDbModel'
import { Category } from '../../domain/category'
import { CategoryMap } from '../../mappers/categoryMap'
import { MongodbWithTenantCollection, MongodbWithTenant } from '../../../../shared/infra/database/mongodb/mongodbTenant'

export class MongoCategoryRepo implements ICategoryRepo {
  constructor() {}

  private getCollection(): MongodbWithTenantCollection<ICategoryDbModel> {
    return MongodbWithTenant.instance.Collection<ICategoryDbModel>('category')
  }

  public async getById(_id: string): Promise<Category> {
    let category = await this.getCollection().findOne({ _id })
    return CategoryMap.toDomain(category)
  }

  public async save(category: Category): Promise<void> {
    const raw = await CategoryMap.toPersistence(category)
    await this.getCollection().updateOne(
      { _id: raw._id },
      {
        $set: {
          name: raw.name,
          parentId: raw.parentId,
          attributes: raw.attributes,
        },
      },
      { upsert: true }
    )

    await DomainEvents.dispatchEventsForAggregate(category)
  }

  public async exist(_id: string): Promise<boolean> {
    let category = await this.getCollection().findOne({ _id })
    return !!category === true
  }

  public async filter(): Promise<Category[]> {
    let categoryList = await this.getCollection().find({}).toArray()
    return categoryList.map((item) => CategoryMap.toDomain(item))
  }
}
