import { fromEvent, BehaviorSubject } from "rxjs";
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
});

moviesApi.getByIdResponse.subscribe(
    e => console.log("get by id worked with result of:", e),
    e => console.log("get by id failed with: ", e),
    () => console.log('done')
);

moviesApi.getById(11);
moviesApi.getById(12);
moviesApi.getById(13);

moviesApi.simpleGet().subscribe(
    e => console.log("simpleGet with result of:", e),
    e => console.log("simpleGet failed with: ", e),
    () => console.log('simpleGet done')
);
moviesApi.simpleGet().subscribe(
    e => console.log("simpleGet2 with result of:", e),
    e => console.log("simpleGet2 failed with: ", e),
    () => console.log('simpleGet2 done')
);

const simpleGet = moviesApi.simpleGet();

simpleGet.subscribe(
    e => console.log("simpleGet3 with result of:", e),
    e => console.log("simpleGet3 failed with: ", e),
    () => console.log('simpleGet3 done')
);
simpleGet.subscribe(
    e => console.log("simpleGet4 with result of:", e),
    e => console.log("simpleGet4 failed with: ", e),
    () => console.log('simpleGet4 done')
);

moviesApi.simpleGetById(1).subscribe(
    e => console.log("simpleGetById(1) with result of:", e),
    e => console.log("simpleGetById(1) failed with: ", e),
    () => console.log('simpleGetById(1) done')
);

moviesApi.simpleGetByIds([1, 2, 3]).subscribe(
    e => console.log("simpleGetByIds[1,2,3] with result of:", e),
    e => console.log("simpleGetById[1,2,3] failed with: ", e),
    () => console.log('simpleGetById[1,2,3] done')
);
moviesApi.simpleGetByIds([4, 2, 3]).subscribe(
    e => console.log("simpleGetByIds[4,2,3] with result of:", e),
    e => console.log("simpleGetById[4,2,3] failed with: ", e),
    () => console.log('simpleGetById[4,2,3] done')
);
//moviesApi.getById(12);