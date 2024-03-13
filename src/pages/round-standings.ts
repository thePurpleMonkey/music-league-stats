import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Member } from 'components/member';
import { Vote } from 'components/vote';

@autoinject
export class RoundStandings {
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

    this.api.get_round_standings(this.league_id, member_id).then((votes) => {
      console.log("Votes:", votes);
      this.votes = votes;

      this.votes.forEach(vote => {
        this.api.get_round_rankings(vote.round.id).then((placements) => {
          const rank = placements.find(p => p.member.id === member_id);
          vote.placement = rank.placement;
        })
      });
    });
  }

  get_round_percentage(round_id: string): number {
    const vote = this.votes.find(v => v.round.id === round_id);
    const member_votes = vote.votes;
    const total_votes = vote.round.total_votes;

    return member_votes / total_votes;
  }
}
