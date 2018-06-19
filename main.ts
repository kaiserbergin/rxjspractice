import { Observable, fromEvent } from "rxjs";
import { map, filter, onErrorResumeNext, delay } from "rxjs/operators";

let numbers = [1, 5, 10];

// let source = Observable.create(observer => {
//     for (let n of numbers) {
//         observer.next(n);
//     }
//     observer.complete();
// })

// let source = Observable.create(observer => {
//     let index = 0;
//     let produceValue = () => {
//         observer.next(numbers[index++]);

//         if (index < numbers.length) {
//             setTimeout(produceValue, 2000);
//         } else {
//             observer.complete();
//         }
//     }
//     produceValue();
// }).pipe(
//     map((n: number) => n * 2),
//     filter((n: number) => n > 4)
// );
let circle = document.getElementById("circle");

let source = fromEvent(document, "mousemove")
    .pipe(
        map((e: MouseEvent) => {
            return { x: e.clientX, y: e.clientY }
        }),
        filter(value => value.x < 500),
        delay(300)
    )


// let source = from(numbers);

function onNext(value) {
    circle.style.left = value.x;
    circle.style.top = value.y;
};

source.subscribe(
    onNext,
    error => console.log(`error: ${error}`),
    () => console.log("complete")
);

// class MyObserver implements Observer<number> {
//     next(value) {
//         console.log(`value: ${value}`);
//     }
//     error(error) {
//         console.log(`error: ${error}`);
//     }
//     complete() {
//         console.log("complete");
//     }
// }

// source.subscribe(new MyObserver());
// source.subscribe(new MyObserver());