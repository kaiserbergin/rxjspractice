import { from, Subject } from "rxjs";
import { scan, delay, retryWhen } from "rxjs/operators";
import { request } from "./http"

//Source the below consts from appsettings...
const HEADERS = null;
const TIMEOUT = 3000;
const RESPONSE_TYPE = 'json' as 'json';

const DEFAULT_RETRY_SETTINGS = {
    GET: {
        ATTEMPTS: 3,
        DELAY: 500
    }
}

// end app settings stuff

function retryRequest({ attempts = 0, delayMs = 500 } = {}) {
    return function (errors) {
        return errors.pipe(
            scan((acc, value) => {
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(`builder error: ${value.toString()}`);
                }
            }, 0),
            delay(delayMs)
        );
    }
}


export function buildGet(
    url,
    { headers, responseType, timeout } =
        {
            headers: HEADERS,
            responseType: RESPONSE_TYPE,
            timeout: TIMEOUT
        },
    { retryAttempts, retryDelay } = {
        retryAttempts: DEFAULT_RETRY_SETTINGS.GET.ATTEMPTS,
        retryDelay: DEFAULT_RETRY_SETTINGS.GET.DELAY
    }) {
    let getRequest = request(
        url,
        {
            method: "GET",
            headers: headers,
            responseType: responseType,
            requestBody: null,
            timeout: timeout
        }
    );
    if (retryAttempts > 0) {
        getRequest = from(getRequest).pipe(
            retryWhen(retryRequest({ attempts: retryAttempts, delayMs: retryDelay }))
        );
    }
    return getRequest;
}

export function buildPost() {

}

export function buildPut() {

}

export function buildDelete() {

}