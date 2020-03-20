export interface CreateFundDto{
    amount: number
    incomeMemberId?: string
    paymentMemberId?: string
    status?: string
    descrption?: string
    type: string
    relationId: string
}