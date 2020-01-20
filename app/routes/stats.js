import Route from "@ember/routing/route";

export default class StatsRoute extends Route {
  model() {
    return this.store.findAll("statistic");
  }
}
