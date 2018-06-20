import { Subject, Observable, interval, BehaviorSubject } from "rxjs";
import { request } from "./http";
import { switchMap, mergeMap } from "rxjs/operators";
import { buildGet } from "./httpRequestBuilder";

const baseUrl = "movies.json";

class test {

    subject = new Subject();
    obsToSub = new Array();

    getById(id: number) {
        if (this.obsToSub.indexOf(id) === -1) {
            let req = buildGet(baseUrl);
            this.obsToSub.push(req);
            this.subject.subscribe(req);
        }
    }

}

export default new test();