import { Member } from "./member";
import { Round } from "./round";

export class Placement {
  member: Member;
  votes: number;
  placement: number;
  round: Round;

  constructor(member: Member, round: Round, votes: number, placement: number) {
    this.member = member;
    this.round = round;
    this.votes = votes;
    this.placement = placement;
  }
}
