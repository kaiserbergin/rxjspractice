import { buildGet } from "./httpRequestBuilder";
import { Subject, BehaviorSubject, from } from "rxjs";
import { switchMap, mergeMap } from "rxjs/operators";

const baseUrl = "movies.json";
class moviesAPI {
    private getRequest = new Subject();
    getResponse = this.getRequest.pipe(switchMap(() => buildGet(baseUrl)));
    get() {
        this.getRequest.next();
    }

    private getByIdRequest = new Subject();
    getByIdResponse = this.getByIdRequest.pipe(mergeMap((id) => buildGet(baseUrl/*`${baseUrl}${id}`*/)));
    getById(id: number) {
        this.getByIdRequest.next(id);
    }

    simpleGet() {
        return buildGet(baseUrl);
    }

    simpleGetById(id: number) {
        return buildGet(`${baseUrl}${id}`);
    }

    simpleGetByIds(ids: number[]) {
        return from(ids).pipe(
            mergeMap((id: number) => this.simpleGetById(id))
        );
    }
}

export default new moviesAPI();