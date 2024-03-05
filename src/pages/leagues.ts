import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { League } from 'components/league';

@autoinject
export class Leagues {
  private api: LeagueApi;

  leagues: League[];

  constructor(api: LeagueApi) {
    this.api = api;
    
    this.api.get_leagues().then((leagues) => {
      this.leagues = leagues;
    });
  }
}
