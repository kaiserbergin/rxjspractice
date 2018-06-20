import { fromEvent, Observable, from, defer, of, merge, throwError, onErrorResumeNext } from "rxjs";
import { delay, flatMap, scan, retryWhen, takeWhile, catchError } from "rxjs/operators";
import { load, loadWithFetch } from "./loader";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function renderMovies(movies) {
    movies.forEach(movie => {
        let div = document.createElement("div");
        div.innerText = movie.title;
        output.appendChild(div);
    });
}

//Although load is called, it is not returned to anyone until someone subscribes.
//load("movies.json").subscribe(renderMovies);
let subscription = load("testCancel.json")
    .subscribe(
        renderMovies,
        e => console.log(`error: ${e}`),
        () => console.log("complete")
    );

console.log(subscription);

subscription.unsubscribe();

load("movies.json").subscribe(
    renderMovies,
    e => console.log(`ui error: ${e}`),
    () => console.log("complete")
);
load("moviess.json").subscribe(
    e => console.log(e),
    e => console.log(`ui error: ${e}`),
    () => console.log("complete")
);

click.pipe(
    flatMap(e => load("games.json"))
).subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);