import { EventAggregator } from 'aurelia-event-aggregator';
import { RouterConfiguration, Router, RouteConfig } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name } from 'components/utilities';

@autoinject
export class League {
  id: string;
  name: string;

  constructor(private router: Router, private events: EventAggregator) {}

  activate(params, routeConfig: RouteConfig) {
    this.id = params.league_id;
    this.name = load_league_name(this.id);
    console.log("League name:", this.name);
    // this.router.currentInstruction.config.title = 
    routeConfig.navModel.setTitle(this.name);

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(this.name, "leagues/:league_id", params)
    ]
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
