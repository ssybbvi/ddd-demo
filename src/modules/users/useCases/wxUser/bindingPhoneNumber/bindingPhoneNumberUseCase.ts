import { AppError } from '../../../../../shared/core/AppError'
import { Either, Result, left, right } from '../../../../../shared/core/Result'
import { UseCase } from '../../../../../shared/core/UseCase'
import { IWxUserRepo } from '../../../repos/wxUserRepo'
import { BindingPhoneNumberDto } from './bindingPhoneNumberDto'
import { WechatUtil } from '../../../../../shared/infra/wx/wxCommon'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<void>>

export class BindingPhoneNumberUseCase implements UseCase<BindingPhoneNumberDto, Promise<Response>> {
  private wxUserRepo: IWxUserRepo

  constructor(wxUserRepo: IWxUserRepo) {
    this.wxUserRepo = wxUserRepo
  }

  public async execute(request: BindingPhoneNumberDto): Promise<Response> {
    try {
      const { userId, iv, encryptedData } = request

      const wxUser = await this.wxUserRepo.getById(userId)

      const result = WechatUtil.WXBizDataCrypt(wxUser.sessionKey, encryptedData, iv)
      wxUser.bindingPhoneNumber(result.purePhoneNumber)

      await this.wxUserRepo.save(wxUser)
      return right(Result.ok<void>())
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()))
    }
  }
}
