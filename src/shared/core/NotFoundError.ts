import { UseCaseError } from "./UseCaseError";
import { Result } from "./Result";

export class NotFoundError extends Result<UseCaseError> {
  constructor(message: string = "无此数据") {
    super(false, {
      message
    } as UseCaseError)
  }
}