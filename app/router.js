import EmberRouter from "@ember/routing/router";
import config from "./config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route("stats");
  this.route("stat-info", function() {
    this.route("info", { path: "/:statistic_id" });
  });
});
