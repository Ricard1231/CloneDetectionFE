import { useEffect, useState } from "react"

const useFetch = (url, method = "GET", body = null, token = null) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let requestInit = {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        };
        if (body) {
            requestInit.body = body;
        }
        if (token) {
            requestInit.headers.Authorization = token;
        }

        fetch(url, requestInit)
            .then(res => {
                if (!res.ok) {
                    throw Error('could not fetch data for ' + url);
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setIsPending(false);
                setError(false);
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    setIsPending(false);
                    setError(err.message);
                }
            })
    }, [url]);

    return { data, isPending, error };
}

export default useFetch;