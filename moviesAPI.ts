import { buildGet } from "./httpRequestBuilder";
import { Subject } from "rxjs";
import { switchMap } from "rxjs/operators";

const baseUrl = "movies.json";
class moviesAPI {
    private getRequest = new Subject();
    getResponse = this.getRequest.pipe(switchMap(() => buildGet(baseUrl)));
    get() {
        return this.getRequest.next();
    }
}

export default new moviesAPI();