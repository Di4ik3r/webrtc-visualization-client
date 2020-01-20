import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class StatisticAdapter extends JSONAPIAdapter {
  host = "http://localhost:3001";
}
