export interface CreateFundDto{
    amount: number
    incomeUserId?: string
    paymentUserId?: string
    status?: string
    descrption?: string
    type: string
    relationId: string
}