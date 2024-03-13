import { EventAggregator } from 'aurelia-event-aggregator';
import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Breadcrumb } from 'components/breadcrumbs';
import { load_league_name, load_round_name } from 'components/utilities';
import { SetBreadcrumbs } from 'components/events';


@autoinject
export class Round {
  league_id: string;
  round_id: string;

  constructor(private api: LeagueApi, private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    this.round_id = params.round_id;
    const league_name = load_league_name(this.league_id);
    const round_name = load_round_name(this.round_id);

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Rounds", "rounds", params),
      new Breadcrumb(round_name, "round", {league_id: this.league_id, round_id: this.round_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
