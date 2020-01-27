import Controller from '@ember/controller';

export default class IndexController extends Controller {
    hello = "hello word";

    constructor(args) {
        super(args);
        console.log(this);
    }
}
