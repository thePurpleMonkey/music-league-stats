import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Votes } from 'components/votes';

@autoinject
export class ByRecipient {
  private api: LeagueApi;

  league_id: string;
  round_id: string;
  votes: Votes[];

  constructor(api: LeagueApi) {
    this.api = api;
  }

  activate(params) {
    this.round_id = params.round_id;
    this.api.get_round_voters(this.round_id).then((votes) => {
      this.votes = votes;
    });
  }
}
