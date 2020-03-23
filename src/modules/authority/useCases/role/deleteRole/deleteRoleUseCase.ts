import { Either, left, Result, right } from '../../../../../shared/core/Result'
import { DeleteRoleRequestDto } from './deleteRoleRequestDto'
import { UseCase } from '../../../../../shared/core/UseCase'
import { AppError } from '../../../../../shared/core/AppError'
import { IRoleRepo } from '../../../repos/roleRepo'
import { DeleteRoleErrors } from './deleteRoleErrors'
import { Guard } from '../../../../../shared/core/Guard'

type Response = Either<DeleteRoleErrors.RoleIdIsNullError | AppError.UnexpectedError | Result<any>, Result<void>>

export class DeleteRoleUseCase implements UseCase<DeleteRoleRequestDto, Promise<Response>> {
  private roleRepo: IRoleRepo

  constructor(_roleRepo: IRoleRepo) {
    this.roleRepo = _roleRepo
  }

  async execute(request?: DeleteRoleRequestDto): Promise<Response> {
    let guardResult = Guard.againstNullOrUndefined(request._id, '删除标示')
    if (!guardResult.succeeded) {
      return left(new DeleteRoleErrors.RoleIdIsNullError(guardResult.message))
    }

    await this.roleRepo.deleteById(request._id)

    return right(Result.ok<void>())
  }
}
