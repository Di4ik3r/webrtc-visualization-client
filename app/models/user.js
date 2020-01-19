import Model, { attr } from "@ember-data/model";

export default class UserModel extends Model {
  @attr login;
  @attr password;
  @attr posts;
}
