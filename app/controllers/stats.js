import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class StatsController extends Controller {
  @action
  searchStat() {
    console.log(this.session_id);
    this.store
      .query("statistic", {
        filter: {
          lesson_id: this.session_id
        }
      })
      .then(result => {
        console.log(result);
        this.model = result;
      });
  }
}
