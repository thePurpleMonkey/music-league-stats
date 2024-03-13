import { EventAggregator } from 'aurelia-event-aggregator';
import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Member } from 'components/member';
import { Vote } from 'components/vote';
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name, load_member_name } from 'components/utilities';

@autoinject
export class RoundStandings {
  league_id: string;
  member: Member;
  votes: Vote[];

  constructor(private api: LeagueApi, private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    const member_id = params.member_id;
    const league_name = load_league_name(this.league_id);
    const member_name = load_member_name(member_id);

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

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Members", "members", params),
      new Breadcrumb(member_name, "member", {league_id: this.league_id, member_id: member_id}),
      new Breadcrumb("Votes Given", "votes_given", {league_id: this.league_id, member_id: member_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }

  get_round_percentage(round_id: string): number {
    const vote = this.votes.find(v => v.round.id === round_id);
    const member_votes = vote.votes;
    const total_votes = vote.round.total_votes;

    return member_votes / total_votes;
  }
}
