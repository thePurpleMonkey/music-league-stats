import { Member } from "./member";
import { Round } from "./round";
import { Track } from "./track";
import { substitute_URLs } from "./utilities"

export class Vote {
  voter: Member;
  votes: number;
  comment: string;
  track: Track;
  round: Round;
  placement: number;

  constructor(voter: Member, votes: number, comment = "", track: Track = undefined, round: Round = undefined) {
    this.voter = voter;
    this.votes = votes;
    this.comment = comment;
    this.track = track;
    this.round = round;
  }

  get_html_comment(): string {
    return substitute_URLs(this.comment).html;
  }
}
