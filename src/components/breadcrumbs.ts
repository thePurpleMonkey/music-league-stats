import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {customElement} from 'aurelia-templating';
import {Router} from 'aurelia-router';
import { SetBreadcrumbs } from './events';

@customElement('breadcrumbs')
@autoinject
export class Breadcrumbs {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private events: EventAggregator) {
    this.events.subscribe(SetBreadcrumbs, (event: SetBreadcrumbs) => {
      console.log("event:", event);
      this.breadcrumbs = event.trail;
    });
  }
}

export class Breadcrumb {
  name: string;
  route: string;
  params;

  constructor(name: string, route: string, params = undefined) {
    this.name = name;
    this.route = route;
    this.params = params;
  }
}