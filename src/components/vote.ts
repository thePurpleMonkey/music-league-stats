import { Member } from "./member";
import { Track } from "./track";

export class Vote {
  voter: Member;
  votes: number;
  comment: string;
  track: Track;

  constructor(voter: Member, votes: number, comment = "", track: Track = undefined) {
    this.voter = voter;
    this.votes = votes;
    this.comment = comment;
    this.track = track;
  }
}
