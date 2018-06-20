import { Observable, defer, from, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { retryWhen, scan, map, delay, flatMap, switchMap } from "rxjs/operators"

export function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        let onLoad = () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete;
            } else {
                observer.error(xhr.statusText);
            }
        }

        xhr.addEventListener("load", onLoad)

        xhr.open("GET", url);
        xhr.send();

        return () => {
            console.log("cleanup");
            xhr.removeEventListener("load", onLoad);
            xhr.abort();
        }
    }).pipe(
        retryWhen(retryStrategy({ attempts: 3, delayMs: 1500 }))
    );
}

export function loadWithFetch(url: string) {
    return defer(() => {
        return from(
            fetch(url).then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    return Promise.reject(res);
                }
            })
        );
    }).pipe(
        retryWhen(retryStrategy())
    );
}

//fix this thing
function retryXHRStrategy(xhr, { attempts = 4, delayMs = 200 } = {}) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    xhr.abort();
                    throw new Error(`error thrown in retryStrategy with value: ${value.toString()}`);
                }
            }, 0),
            delay(delayMs)
        );
    }
}


function retryStrategy({ attempts = 4, delayMs = 200 } = {}) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(`error thrown in retryStrategy with error message: ${value.toString()}`);
                }
            }, 0),
            delay(delayMs)
        );
    }
}