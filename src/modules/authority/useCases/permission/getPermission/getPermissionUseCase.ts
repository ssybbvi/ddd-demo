import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { GetPermissionRequestDto } from './getPermissionRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { Permission } from '../../../domain/permission'
import { PermissionName } from '../../../domain/permissionName'
import { PermissionDiscriminator } from '../../../domain/permissionDiscriminator'
import { IPermissionRepo } from '../../../repos/permissionRepo'
import { GetPermissionResponseDto } from './getPermissionResponseDto'
import { PermissionMap } from '../../../mappers/permissionMap'
import { PermissionDTO } from '../../../dtos/permissionDTO'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<PermissionDTO[]>>

export class GetPermissionUseCase implements UseCase<GetPermissionRequestDto, Promise<Response>> {
  private permissionRepo: IPermissionRepo

  constructor(_permissionRepo: IPermissionRepo) {
    this.permissionRepo = _permissionRepo
  }

  async execute(request?: GetPermissionRequestDto): Promise<Response> {
    try {
      let permissionList = await this.permissionRepo.filter()
      let permissionDtoList = permissionList.map((item) => PermissionMap.toDto(item))
      return right(Result.ok<PermissionDTO[]>(permissionDtoList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
