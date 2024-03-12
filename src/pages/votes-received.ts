import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Member } from 'components/member';
import { Vote } from 'components/vote';

@autoinject
export class VotesReceived {
  private api: LeagueApi;

  league_id: string;
  member: Member;
  votes: Vote[];

  constructor(api: LeagueApi) {
    this.api = api;
  }

  activate(params) {
    this.league_id = params.league_id;
    const member_id = params.member_id;

    this.api.get_member(member_id).then((member) => {
      console.log("Member:", member);
      this.member = member;
    });

    this.api.get_votes_received(this.league_id, member_id).then((votes) => {
      console.log("Votes:", votes);
      this.votes = votes;
    });
  }
}
