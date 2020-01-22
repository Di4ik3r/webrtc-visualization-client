import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class StatsController extends Controller {
  @action
  searchStat() {
    console.log("clicked");
  }
}
