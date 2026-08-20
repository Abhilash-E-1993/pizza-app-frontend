import axios from "axios";

// Single shared axios instance for the whole app.
// Auth uses httpOnly cookie (`token`) AND Authorization header fallback
// to guarantee support across cross-domain deployments (Netlify + Render).
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Attach Authorization header if token exists in localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 401s from these URLs are part of the normal auth flow
// (failed login attempt / "am I logged in?" check) — never treat
// them as an expired session.
const AUTH_FLOW_URLS = ["/auth/login", "/auth/verify", "/users/register"];

// ONE central response interceptor. Individual thunks/components should
// NOT also redirect or toast for 401/403 — it all happens here via events
// that App.jsx listens to (events avoid a store <-> axios import cycle).
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url || "";

        if (status === 401 && !AUTH_FLOW_URLS.some((u) => requestUrl.includes(u))) {
            window.dispatchEvent(new CustomEvent("auth:session-expired"));
        }

        if (status === 403) {
            window.dispatchEvent(new CustomEvent("auth:forbidden"));
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;