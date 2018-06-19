import { Observable, defer, from } from "rxjs";
import { retryWhen, scan, takeWhile, delay, flatMap } from "rxjs/operators"

export function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete;
            } else {
                observer.error(xhr.statusText);
            }
        })

        xhr.open("GET", url);
        xhr.send();
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

function retryStrategy({ attempts = 4, delayMs = 200 } = {}) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(value.toString());
                }
            }, 0),
            delay(delayMs)
        );
    }
}