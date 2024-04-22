import { EventAggregator } from 'aurelia-event-aggregator';
import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Member } from 'components/member';
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name, load_member_name, load_round_name } from 'components/utilities';

@autoinject
export class Similarity {
  league_id: string;
  round_id: string;
  member: Member;
  similarities: Member[];

  constructor(private api: LeagueApi, private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    this.round_id = params.round_id;
    const member_id = params.member_id;
    const league_name = load_league_name(this.league_id);
    const round_name = load_round_name(this.round_id);
    const member_name = load_member_name(member_id);

    this.api.get_member(member_id).then((member) => {
      console.log("Member:", member);
      this.member = member;
    });

    console.log("Round ID:", this.round_id);
    console.log("Member ID:", member_id);
    this.api.get_similarities(this.round_id, member_id).then((similarities) => {
      console.log("Similarities:", similarities);
      this.similarities = similarities;

      this.similarities.forEach((similarity, member) => {
        console.log(member, similarity);
      });
    });

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Rounds", "rounds", {league_id: this.league_id}),
      new Breadcrumb(round_name, "round", {league_id: this.league_id, round_id: this.round_id}),
      new Breadcrumb("Round Members", "round_members", params),
      new Breadcrumb(member_name, "member", {league_id: this.league_id, member_id: member_id}),
      new Breadcrumb("Voting Similarity", "similarity", {league_id: this.league_id, member_id: member_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
