import {useState, useCallback, useRef, useEffect} from "react";
import axios from "axios";
import axiosInstance from "../utils/axios";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const activeRequests = useRef([]);

    const sendRequest = useCallback(async (url, method='GET', data = null, headers = {}) => {
        setIsLoading(true);
        const source = axios.CancelToken.source();
        activeRequests.current.push(source);

        try {
            const res = await axiosInstance({method, url, data, headers: headers, cancelToken: source.token});
            activeRequests.current = activeRequests.current.filter(reqCtrl => reqCtrl !== source); //delete processed reqController
            setIsLoading(false);
            return res
        } catch (e) {
            setError(e.response.data.message || 'Something went wrong, try again');
            setIsLoading(false);
            throw e
        }
    }, []);

    const clearError = () => {
      setError(null)
    };

    useEffect(() => {
        return () => { // cancel processing http requests when component unmounts
            activeRequests.current.forEach(abortController => abortController.cancel())
        }
    }, [])

    return {isLoading, error, sendRequest, clearError}
};
