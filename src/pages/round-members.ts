import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { LeagueApi } from "api";
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name, load_round_name, save_round_names } from 'components/utilities';
import { Member } from 'components/member';

@autoinject
export class RoundMembers {
  league_id: string;
  round_id: string;
  members: Member[];

  constructor(private api: LeagueApi, private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    this.round_id = params.round_id;
    const league_name = load_league_name(this.league_id);
    const round_name = load_round_name(this.round_id);

    console.log("League name:", league_name);

    this.api.get_round_members(this.round_id).then((members) => {
      this.members = members;
    });

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Rounds", "rounds", params),
      new Breadcrumb(round_name, "round", {league_id: this.league_id, round_id: this.round_id}),
      new Breadcrumb("Round Members", "round_members", {league_id: this.league_id, round_id: this.round_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
