import { GetListUseCase } from "../../useCases/wxUser/getList/getListUseCase";
import { CommonRedisClient } from "../../../../shared/infra/database/redis/commonRedisClient";
import { left } from "../../../../shared/core/Result";
import { WxUser } from "../../domain/wxUser";
import { WxUserDTO } from "../../dtos/wxUserDto";
import { WxUserMap } from "../../mappers/wxUserMap";

export class WxUserDtoCache {
  private useCase: GetListUseCase
  private commonRedisClient: CommonRedisClient
  constructor(useCase: GetListUseCase, commonRedisClient: CommonRedisClient) {
    this.useCase = useCase
    this.commonRedisClient = commonRedisClient
  }

  private format(userId: string) {
    return `dto.${this.constructor.name}.${userId}`
  }

  public async load() {
    const wxUserListResult = await this.useCase.execute({})
    if (wxUserListResult.isLeft()) {
      return left(wxUserListResult)
    }
    const wxUserList = wxUserListResult.value.getValue()
    wxUserList.forEach(item => {
      this.set(item)
    })
  }

  public async set(wxUser: WxUser) {
    let dto = await WxUserMap.toDTO(wxUser)
    this.commonRedisClient.set(this.format(dto._id), JSON.stringify(dto))
  }

  public async getValue(userId: string): Promise<WxUserDTO | null> {
    const value = await this.commonRedisClient.getOne<string>(this.format(userId))
    return JSON.parse(value)
  }
}