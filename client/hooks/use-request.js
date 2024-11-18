import axios from "axios";
import { useState } from "react";
axios.defaults.withCredentials = true;
export default ({ url, method, body, onSuccess }) => {
    
    const [errors, setError] = useState();
    const doRequest = async(props={}) => {
        try {
            setError(null)
            const response = await axios[method](url, {...body,...props});
            if (onSuccess) {
                onSuccess(response.data)
            }
                 return response.data;
        } catch (error) {
            setError(
            <div className="alert alert-danger">
                <h1>Ooops...</h1>
                <ul className="my-0">
                    {error?.response?.data?.errors?.map(err => <li key={err.message}>{err.message}</li> )}
                </ul>
                            
                </div>
            )
        }
    };

    return { doRequest, errors };
}