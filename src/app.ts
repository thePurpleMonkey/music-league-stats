import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Music League Stats";
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: ["", "leauges"], moduleId: PLATFORM.moduleName("pages/leagues"), title: "Leagues", name: "leagues", nav: true },
      { route: "league/:league_id", moduleId: PLATFORM.moduleName("pages/league"), title: "League", name: "league" },
      { route: "league/:league_id/rounds", moduleId: PLATFORM.moduleName("pages/rounds"), title: "Rounds", name: "rounds" },
      { route: "league/:league_id/members", moduleId: PLATFORM.moduleName("pages/members"), title: "Members", name: "members" },
      { route: "league/:league_id/round/:round_id", moduleId: PLATFORM.moduleName("pages/round"), title: "Round", name: "round" },
      { route: "league/:league_id/round/:round_id/by_voter", moduleId: PLATFORM.moduleName("pages/by-voter"), title: "Round by Voter", name: "by_voter" },
      { route: "league/:league_id/round/:round_id/by_recipient", moduleId: PLATFORM.moduleName("pages/by-recipient"), title: "Round by Submission", name: "by_recipient" },
    ]);

    this.router = router;
  }
}
