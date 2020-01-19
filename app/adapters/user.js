import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class UserAdapter extends JSONAPIAdapter {
  host = "http://localhost:3001";
}
