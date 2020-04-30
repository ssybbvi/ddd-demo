import { left, Result, Either, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { WxUser } from '../../../domain/wxUser'
import { GetListDto } from './getListDto'

type Response = Either<AppError.UnexpectedError, Result<WxUser[]>>

export class GetListUseCase implements UseCase<GetListDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo

  constructor(wxUserRepo: IWxUserRepo) {
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: GetListDto): Promise<Response> {
    try {
      const list = await this.wxUserRepo.filter()

      return right(Result.ok<WxUser[]>(list))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
