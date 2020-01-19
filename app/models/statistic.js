import Model, { attr } from "@ember-data/model";

export default class StatisticModel extends Model {
  @attr("number") event_type;
}
