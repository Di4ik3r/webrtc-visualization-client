import Route from "@ember/routing/route";

export default class UsersRoute extends Route {
  model() {
    return this.store.findAll("user"); //await (await fetch("http://localhost:3001/user")).json(); .then(result => console.log(result));
  }
}
