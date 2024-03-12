import { autoinject } from 'aurelia-framework';
import { LeagueApi } from "api";
import { Member } from 'components/member';

@autoinject
export class Members {
  private api: LeagueApi;

  league_id: string;
  members: Member[];

  constructor(api: LeagueApi) {
    this.api = api;
  }

  activate(params) {
    this.league_id = params.league_id;
    this.api.get_league_members(this.league_id).then((members) => {
      this.members = members;
    });
  }
}
