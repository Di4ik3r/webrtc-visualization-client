import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class DashboardSearchbarComponent extends Component {
    
    @action
    search(input) {
        // let input = document.getElementById("searchbar").value

        console.log(input)

        // let id = +input || null
        // if(id) {
        //     this.sendAction()
        // }
    }

    @action
    key() {
        console.log(this.lesson_id)
    }
}
