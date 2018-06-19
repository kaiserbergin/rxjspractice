import { fromEvent, Observable, from, defer } from "rxjs";
import { delay, flatMap, scan, retryWhen, takeWhile } from "rxjs/operators";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function load(url: string) {
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

function loadWithFetch(url: string) {
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

function renderMovies(movies) {
    movies.forEach(movie => {
        let div = document.createElement("div");
        div.innerText = movie.title;
        output.appendChild(div);
    });
}

//Although load is called, it is not returned to anyone until someone subscribes.
//load("movies.json").subscribe(renderMovies);
loadWithFetch("movies.json");

click.pipe(
    flatMap(e => loadWithFetch("movies.json"))
).subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);