import axios from "axios";

const axiosInstance=axios.create(); //create the new axios instance
axiosInstance.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;//set the base URL
console.log(import.meta.env.VITE_BACKEND_URL);

axiosInstance.defaults.withCredentials=true; //allow the cookies to be sent with requests
export default axiosInstance;
