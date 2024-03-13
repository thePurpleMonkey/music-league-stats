import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { LeagueApi } from "api";
import { Round } from "components/round";
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name, save_round_names } from 'components/utilities';

@autoinject
export class Rounds {
  league_id: string;
  rounds: Round[];

  constructor(private api: LeagueApi, private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    const league_name = load_league_name(this.league_id);
    console.log("League name:", league_name);

    this.api.get_rounds(this.league_id).then((rounds) => {
      this.rounds = rounds;
      save_round_names(rounds);
    });

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Rounds", "rounds", params),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
