import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class IndexController extends Controller {
  hello = "hello word";

  constructor(args) {
    super(args);
    //console.log(this);
  }

  @action
  searchStat() {
    this.store
      .query("statistic", {
        filter: {
          lesson_id: this.lesson_id
        }
      })
      .then(result => {
        this.model = result;
      });
  }
}
