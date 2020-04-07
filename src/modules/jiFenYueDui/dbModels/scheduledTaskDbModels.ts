export interface IScheduledTaskDbModels {
  _id: string
  argument: any
  userId: string
  type: string
  executionTime: number
  isExecuted: boolean
  createAt?: number
  isSuccess?: boolean
  result?: string
}
