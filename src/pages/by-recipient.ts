import { EventAggregator } from 'aurelia-event-aggregator';
import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Submission } from 'components/submission';
import { load_league_name, load_round_name } from 'components/utilities';
import { Breadcrumb } from 'components/breadcrumbs';
import { SetBreadcrumbs } from 'components/events';

@autoinject
export class ByRecipient {
  league_id: string;
  round_id: string;
  submissions: Submission[];

  constructor(private api: LeagueApi, private events: EventAggregator) {}

  activate(params) {
    this.league_id = params.league_id;
    this.round_id = params.round_id;
    const league_name = load_league_name(this.league_id);
    const round_name = load_round_name(this.round_id);
    
    this.api.get_submissions(this.round_id).then((submissions) => {
      this.submissions = submissions;
    });

    const breadcrumbs = [
      new Breadcrumb("Leagues", "leagues"),
      new Breadcrumb(league_name, "league", {league_id: this.league_id}),
      new Breadcrumb("Rounds", "rounds", params),
      new Breadcrumb(round_name, "round", {league_id: this.league_id, round_id: this.round_id}),
      new Breadcrumb("By Submission", "by_recipient", {league_id: this.league_id, round_id: this.round_id}),
    ];
    this.events.publish(new SetBreadcrumbs(breadcrumbs));
  }
}
