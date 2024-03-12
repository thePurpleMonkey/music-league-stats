import { Member } from "./member";
import { Track } from "./track";
import { Vote } from "./vote";

export class Submission {
  track: Track;
  submitter: Member;
  votes: Vote[];
  comment: string;

  constructor(track: Track, submitter: Member, votes: Vote[] = [], comment = "") {
    this.track = track;
    this.submitter = submitter;
    this.votes = votes;
    this.comment = comment;
  }

  total_votes(): number {
    return this.votes.reduce((accumulator, currentValue) => accumulator + currentValue.votes, 0);
  }
}
