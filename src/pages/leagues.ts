import { Breadcrumb } from './../components/breadcrumbs';
import { EventAggregator } from 'aurelia-event-aggregator';
import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { League } from 'components/league';
import { SetBreadcrumbs } from 'components/events';
import { save_league_names } from 'components/utilities';

@autoinject
export class Leagues {
  leagues: League[];

  constructor(private api: LeagueApi, private events: EventAggregator) {
    this.api.get_leagues().then((leagues) => {
      this.leagues = leagues;
      console.log("Leagues:", leagues);
      save_league_names(leagues);
    });
  }

  activate() {
    const breadcrumb = new Breadcrumb("Leagues", "leagues");
    this.events.publish(new SetBreadcrumbs([breadcrumb]));
  }
}
