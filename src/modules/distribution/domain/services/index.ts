import { SharedRewardToInvitedMemberService } from './sharedRewardToInvitedMemberService'
import { memberRepo, signInRepo, fundRepo } from '../../repos'

const sharedRewardToInvitedMemberService = new SharedRewardToInvitedMemberService(fundRepo, memberRepo)

export { sharedRewardToInvitedMemberService }
