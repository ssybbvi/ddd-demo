
import { WatchedList } from "../../../shared/domain/WatchedList";
import { Participant } from "./participant";

export class Participants extends WatchedList<Participant> {
  private constructor(initialVotes: Participant[]) {
    super(initialVotes)
  }

  public compareItems(a: Participant, b: Participant): boolean {
    return a.equals(b)
  }

  public static create(participant?: Participant[]): Participants {
    return new Participants(participant ? participant : []);
  }
}