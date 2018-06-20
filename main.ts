import { fromEvent } from "rxjs";
import moviesApi from "./moviesAPI";

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function renderMovies(movies) {
    console.log("getting called to render now!");
    movies.forEach(movie => {
        let div = document.createElement("div");
        div.innerText = movie.title;
        output.appendChild(div);
    });
}

moviesApi.getResponse.subscribe(
    renderMovies,
    e => console.log(e),
    () => console.log("complete")
);
moviesApi.get();
moviesApi.get();
moviesApi.get();
moviesApi.get();



click.subscribe(() => {
    moviesApi.get();
    moviesApi.get();
    moviesApi.get();
});