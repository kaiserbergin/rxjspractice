import { fromEvent, Observable, from, defer, of, merge, throwError, onErrorResumeNext } from "rxjs";
import { delay, flatMap, scan, retryWhen, takeWhile, catchError } from "rxjs/operators";
import { load, loadWithFetch } from "./loader";

let source = merge(
    of(1),
    from([2, 3, 4]),
    throwError(new Error("Stop")),
    of(5)
).pipe(
    catchError(e => {
        console.log(`caught: ${e}`);
        return of(10);
    })
)

source.subscribe(
    v => console.log(`value: ${v}`),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);

// let output = document.getElementById("output");
// let button = document.getElementById("button");

// let click = fromEvent(button, "click");



// function renderMovies(movies) {
//     movies.forEach(movie => {
//         let div = document.createElement("div");
//         div.innerText = movie.title;
//         output.appendChild(div);
//     });
// }

// //Although load is called, it is not returned to anyone until someone subscribes.
// //load("movies.json").subscribe(renderMovies);
// loadWithFetch("movies.json");

// click.pipe(
//     flatMap(e => loadWithFetch("movies.json"))
// ).subscribe(
//     renderMovies,
//     e => console.log(`error: ${e}`),
//     () => console.log("complete")
// );