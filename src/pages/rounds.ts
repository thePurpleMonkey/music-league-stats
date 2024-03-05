import { autoinject } from 'aurelia-framework';
import { LeagueApi } from "api";
import { Round } from "components/round";

@autoinject
export class Rounds {
  private api: LeagueApi;

  league_id: string;
  rounds: Round[];

  constructor(api: LeagueApi) {
    this.api = api;
  }

  activate(params) {
    this.league_id = params.league_id;
    this.api.get_rounds(this.league_id).then((rounds) => {
      this.rounds = rounds;
    });
  }
}
