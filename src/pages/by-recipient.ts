import { LeagueApi } from 'api';
import { autoinject } from 'aurelia-framework';
import { Submission } from 'components/submission';

@autoinject
export class ByRecipient {
  private api: LeagueApi;

  league_id: string;
  round_id: string;
  submissions: Submission[];

  constructor(api: LeagueApi) {
    this.api = api;
  }

  activate(params) {
    this.round_id = params.round_id;
    this.api.get_submissions(this.round_id).then((submissions) => {
      this.submissions = submissions;
    });
  }
}
