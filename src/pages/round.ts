import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';


@autoinject
export class Round {
  private api: LeagueApi;

  league_id: string;
  round_id: string;

  constructor(api: LeagueApi) {
    this.api = api;
  }

  activate(params) {
    this.league_id = params.league_id;
    this.round_id = params.round_id;
  }
}
