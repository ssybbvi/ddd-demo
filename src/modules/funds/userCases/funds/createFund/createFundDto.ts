export interface CreateFundDto {
    amount: number
    incomeUserId?: string
    paymentUserId?: string
    status?: string
    description?: string
    type: string
    relationId: string
}