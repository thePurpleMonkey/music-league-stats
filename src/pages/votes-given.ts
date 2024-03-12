import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Vote } from 'components/vote';
import { Member } from 'components/member';

@autoinject
export class VotesGiven {
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
    console.log("League ID:", this.league_id);
    console.log("Member ID:", member_id);
    this.api.get_member(member_id).then((member) => {
      console.log("Member:", member);
      this.member = member;
    });

    this.api.get_votes_given(this.league_id, member_id).then((votes) => {
      console.log("Votes:", votes);
      this.votes = votes;
    });
  }
}
