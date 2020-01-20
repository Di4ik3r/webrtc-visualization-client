import Model, { attr } from "@ember-data/model";

export default class StatisticModel extends Model {
  @attr("number") event_type;
  @attr("string") note;
  @attr("string") user_agent;
  @attr stats;
  @attr("date") created_at;
  @attr("date") updated_at;
}
