import { RouterConfiguration } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';

@autoinject
export class League {
  id: string;
  name: string;

  activate(params) {
    this.id = params.league_id;
  }
}
