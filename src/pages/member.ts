import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';
import { load_league_name, load_member_name } from 'components/utilities';

@autoinject
export class Member {
  league_id: string;
  member_id: string;

  constructor(private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    this.member_id = params.member_id;
    const league_name = load_league_name(this.league_id);
    const member_name = load_member_name(this.member_id);

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Members", "members", params),
      new Breadcrumb(member_name, "member", {league_id: this.league_id, member_id: this.member_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
