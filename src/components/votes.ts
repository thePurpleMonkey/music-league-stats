import { Member } from "./member";
import { Vote } from "./vote";

export class Votes {
  voter: Member;
  votes: Vote[];

  constructor(voter: Member, votes: Vote[] = []) {
    this.voter = voter;
    this.votes = votes;
  }
}
