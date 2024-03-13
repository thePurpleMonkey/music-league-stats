import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { LeagueApi } from "api";
import { Member } from 'components/member';
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name, save_member_names } from 'components/utilities';

@autoinject
export class Members {
  league_id: string;
  members: Member[];

  constructor(private api: LeagueApi, private events: EventAggregator) {
    this.api = api;
  }

  activate(params) {
    this.league_id = params.league_id;
    const league_name = load_league_name(this.league_id);

    this.api.get_league_members(this.league_id).then((members) => {
      this.members = members;
      save_member_names(this.members);
    });

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Members", "members", {league_id: this.league_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
