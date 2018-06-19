import { Observable, defer, from } from "rxjs";
import { retryWhen, scan, takeWhile, delay } from "rxjs/operators"

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
        return from(fetch(url).then(r => r.json()));
    });
}

function retryStrategy({ attempts = 4, delayMs = 500 }) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                return acc + 1;
            }, 0),
            takeWhile(acc => acc < attempts),
            delay(delayMs)
        );
    }
}