import { Observable, Subject, observable, AsyncSubject } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

const responseTypeHandler = (responseType, xhr) => {
    switch (responseType) {
        case 'json' as 'json':
            return xhr.response;
        case 'document' as 'document':
            return xhr.document;
        default:
            return xhr.responseText;
    }
}

export function request(
    url,
    { method, headers, responseType, requestBody, timeout } =
        {
            method: "GET",
            headers: null,
            responseType: 'json' as 'json',
            requestBody: null,
            timeout: 30000
        }
) {
    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        let onLoad = () => {
            if (xhr.status === 200) {
                let data = responseTypeHandler(responseType, xhr);
                observer.next(data);
                observer.complete;
            } else {
                observer.error(xhr.statusText);
            }
        }

        xhr.addEventListener("load", onLoad);

        xhr.timeout = timeout;
        xhr.responseType = responseType;

        xhr.open(method, url);

        if (headers !== null) {
            headers.map(header => xhr.setRequestHeader(header.header, header.value));
        }

        xhr.send(requestBody);

        return () => {
            xhr.removeEventListener("load", onLoad);
            xhr.abort();
        }
    });
};