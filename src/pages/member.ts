import { autoinject } from 'aurelia-framework';

@autoinject
export class Member {
  league_id: string;
  member_id: string;

  activate(params) {
    this.league_id = params.league_id;
    this.member_id = params.member_id;
  }
}
