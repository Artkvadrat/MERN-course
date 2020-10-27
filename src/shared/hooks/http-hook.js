import { useState, useCallback, useRef, useEffect } from 'react';

/*
*
* This is a custom hook that helps to avoid a copy paste of code
* in components that use a fetch requests.
*
* @param {url} string
* @param {method} string
* @param {requestBody} json object
* @param {headers} object
*
* @return {isLoading} bool
* @return {error} string
* @return {sendRequest} function
*
* */

export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    //if we will change the page, it will caused an error
    // to prevent it, we use useRef and than abortController
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(
        async (url, method = 'GET', requestBody = null, headers = {}) => {
        setIsLoading(true);

        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            let body;
            if (requestBody) {
                body = JSON.stringify(requestBody);
            }
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl)

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError }
};
