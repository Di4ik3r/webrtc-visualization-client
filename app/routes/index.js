// <<<<<<< Updated upstream
import Route from "@ember/routing/route";

export default class IndexRoute extends Route {
  model() {
    return this.store.findAll("statistic").then(res => {
      return [res.get("firstObject")];
    });
  }
}