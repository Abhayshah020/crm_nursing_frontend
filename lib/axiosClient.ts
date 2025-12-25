import axios from "axios";
import Cookies from "js-cookie"; // or 'universal-cookie' if SSR

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Interceptor to attach JWT token from cookies
axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get("accessToken"); // cookie name used to store JWT
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
