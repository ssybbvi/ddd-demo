import { DayDayTaskType } from "../dayDayTaskType";

export class DayDayTaskService {

  public getIsOneTimeByType(type: DayDayTaskType) {
    return ["registered", "phoneAuthorization"].includes(type)
  }

  public getRewardByTaskType(type: DayDayTaskType): number {

    if (type === "registered") {
      return 200
    }

    if (type === "phoneAuthorization") {
      return 100
    }

    if (type === "order") {
      return 100
    }

    if (type === "browseMall") {
      return 20
    }

    if (type === "publishBargain") {
      return 20
    }

    if (type === "playGame") {
      return 20
    }

    if (type === "helpFriendBargain") {
      return 50
    }

    if (type === "inviteOneFriends") {
      return 100
    }

    if (type === "inviteTwoFriends") {
      return 300
    }

    if (type === "inviteThreeFriends") {
      return 500
    }

    if (type === "remind") {
      return 100
    }

    return 0
  }
}