import axios from "axios";

export default ({req}) => {
    if (typeof window === "undefined") {
        // We are on the server!
        // Make requests to the backend service directly (e.g., through ingress-nginx)
         console.log('on server')
        return axios.create(
            {
                baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
                headers: req.headers, // Forwarding headers for authentication purposes
            }
        );
       
    } else {
        console.log("on browser")
        // We are on the browser!
        // Requests can be made to the base URL
        return axios.create({baseURL:"/"});
    }
}