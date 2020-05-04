import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { GetRoleReqeustDto } from './getRoleReqeustDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { IRoleRepo } from '../../../repos/roleRepo'
import { RoleMap } from '../../../mappers/roleMap'
import { RoleDTO } from '../../../dtos/roleDto'

type Response = Either<AppError.UnexpectedError | Result<any>, Result<RoleDTO[]>>

export class GetRoleUseCase implements UseCase<GetRoleReqeustDto, Promise<Response>> {
  private roleRepo: IRoleRepo

  constructor(_roleRepo: IRoleRepo) {
    this.roleRepo = _roleRepo
  }

  async execute(request?: GetRoleReqeustDto): Promise<Response> {
    try {
      let roleList = await this.roleRepo.filter()
      let roleDtoList = roleList.map((item) => RoleMap.toDto(item))
      return right(Result.ok<RoleDTO[]>(roleDtoList))
    } catch (err) {
      return left(new AppError.UnexpectedError(err))
    }
  }
}
