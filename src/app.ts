import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Music League Stats";
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      // { route: ["", "leauges"], moduleId: PLATFORM.moduleName("pages/leagues"), title: "Leagues", name: "leagues", nav: true },
      { route: "", redirect: "leagues" },
      { route: "leagues", moduleId: PLATFORM.moduleName("pages/leagues"), title: "Leagues", name: "leagues", nav: true },
      { route: "leagues/:league_id", moduleId: PLATFORM.moduleName("pages/league"), title: "League", name: "league" },
      { route: "leagues/:league_id/members", moduleId: PLATFORM.moduleName("pages/members"), title: "Members", name: "members" },
      { route: "leagues/:league_id/members/:member_id", moduleId: PLATFORM.moduleName("pages/member"), title: "Member", name: "member" },
      { route: "leagues/:league_id/members/:member_id/votes_given", moduleId: PLATFORM.moduleName("pages/votes-given"), title: "Votes Given", name: "votes_given" },
      { route: "leagues/:league_id/members/:member_id/votes_received", moduleId: PLATFORM.moduleName("pages/votes-received"), title: "Votes Received", name: "votes_received" },
      { route: "leagues/:league_id/members/:member_id/round_standings", moduleId: PLATFORM.moduleName("pages/round-standings"), title: "Round Standings", name: "round_standings" },
      { route: "leagues/:league_id/members/:member_id/favorite_songs", moduleId: PLATFORM.moduleName("pages/favorite-songs"), title: "Favorite Songs", name: "favorite_songs" },
      { route: "leagues/:league_id/members/:member_id/similarity", moduleId: PLATFORM.moduleName("pages/league-similarity"), title: "Voting Comparison", name: "league_similarity" },
      { route: "leagues/:league_id/rounds", moduleId: PLATFORM.moduleName("pages/rounds"), title: "Rounds", name: "rounds" },
      { route: "leagues/:league_id/rounds/:round_id", moduleId: PLATFORM.moduleName("pages/round"), title: "Round", name: "round" },
      { route: "leagues/:league_id/rounds/:round_id/by_voter", moduleId: PLATFORM.moduleName("pages/by-voter"), title: "Round by Voter", name: "by_voter" },
      { route: "leagues/:league_id/rounds/:round_id/by_recipient", moduleId: PLATFORM.moduleName("pages/by-recipient"), title: "Round by Submission", name: "by_recipient" },
      { route: "leagues/:league_id/rounds/:round_id/similarity", moduleId: PLATFORM.moduleName("pages/round-members"), title: "Round Members", name: "round_members" },
      { route: "leagues/:league_id/rounds/:round_id/similarity/:member_id", moduleId: PLATFORM.moduleName("pages/similarity"), title: "Voting Comparison", name: "similarity" },
    ]);

    this.router = router;
  }
}
