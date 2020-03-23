import { WatchedList } from '../../../shared/domain/WatchedList'
import { Permission } from './permission'
import { Result } from '../../../shared/core/Result'

export class PermissionIds extends WatchedList<string> {
  private constructor(initialVotes: string[]) {
    super(initialVotes)
  }

  public compareItems(a: string, b: string): boolean {
    return a === b
  }

  public static create(permissions?: string[]): Result<PermissionIds> {
    return Result.ok<PermissionIds>(new PermissionIds(permissions))
  }
}
