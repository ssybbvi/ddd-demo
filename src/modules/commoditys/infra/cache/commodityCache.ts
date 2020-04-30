import { CommonRedisClient } from "../../../../shared/infra/database/redis/commonRedisClient";
import { left } from "../../../../shared/core/Result";
import { GetCommodityUseCase } from "../../userCases/commoditys/getCommodity/getCommodityUseCase";
import { Commodity } from "../../domain/commodity";
import { CommodityDto } from "../../dtos/commodityDto";
import { CommodityMap } from "../../mappers/commodityMap";

export class CommodityCache {
  private useCase: GetCommodityUseCase
  private commonRedisClient: CommonRedisClient
  constructor(useCase: GetCommodityUseCase, commonRedisClient: CommonRedisClient) {
    this.useCase = useCase
    this.commonRedisClient = commonRedisClient
  }

  private format(userId: string) {
    return `dto.${this.constructor.name}.${userId}`
  }

  public async load() {
    const listResult = await this.useCase.execute({})
    if (listResult.isLeft()) {
      return left(listResult)
    }
    const list = listResult.value.getValue()
    list.forEach(item => {
      this.set(item)
    })
  }

  public async set(wxUser: Commodity) {
    let dto = await CommodityMap.toDTO(wxUser)
    this.commonRedisClient.set(this.format(dto._id), JSON.stringify(dto))
  }

  public async getValue(userId: string): Promise<CommodityDto | null> {
    const value = await this.commonRedisClient.getOne<string>(this.format(userId))
    return JSON.parse(value)
  }
}