import { fromEvent, Observable } from "rxjs";
import { map, filter, onErrorResumeNext, delay, flatMap } from "rxjs/operators";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function load(url: string) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("load", () => {
            let data = JSON.parse(xhr.responseText);
            observer.next(data);
            observer.complete;
        })

        xhr.open("GET", url);
        xhr.send();
    })
}

function renderMovies(movies) {
    movies.forEach(movie => {
        let div = document.createElement("div");
        div.innerText = movie.title;
        output.appendChild(div);
    });
}

//Although load is called, it is not returned to anyone until someone subscribes.
load("movies.json");

click.pipe(
    flatMap(e => load("movies.json"))
).subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);