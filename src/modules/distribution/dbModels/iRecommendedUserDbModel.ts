import { FundType } from '../../funds/domain/fundType'
import { IBaseIdDbModels } from '../../../shared/infra/database/dbModel/baseIdDbModels';
import { ITenantIdDbModel } from '../../../shared/infra/database/dbModel/tenantIdDbModel';

export interface IRecommendedUserDbModel extends IBaseIdDbModels, ITenantIdDbModel {


  distributionRelationList: DistributionRelationDbModel[]
}

interface DistributionRelationDbModel {
  recommendedUserId: string
  distributionRate: number
  fundType: FundType
}
