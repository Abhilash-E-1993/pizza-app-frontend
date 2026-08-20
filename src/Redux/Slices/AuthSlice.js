import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// Auth is cookie-based (httpOnly) — the ONLY source of truth is the server.
// localStorage keeps a *display-only* cache of the profile (firstName/email)
// so the navbar doesn't flicker while /auth/verify is in flight. It is never
// used to decide "isLoggedIn".
const cachedUser = (() => {
    try {
        return JSON.parse(localStorage.getItem("data")) || {};
    } catch {
        return {};
    }
})();

const initialState = {
    isLoggedIn: false,
    role: "",
    data: cachedUser,
    authChecked: false, // flips true once the first /auth/verify resolves
};

// ================= VERIFY SESSION (app boot) =================
// Silent by design — a 401 here just means "visitor is not logged in".
export const verifyAuth = createAsyncThunk(
    "/auth/verify",
    async (_, thunkAPI) => {
        try {
            const response = await axiosInstance.get("/auth/verify");
            return response.data; // { success, message, data: { id, email, role } }
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.response?.data);
        }
    }
);

// ================= CREATE ACCOUNT =================

export const createAccount = createAsyncThunk(
    "/auth/createAccount",

    async (data, thunkAPI) => {

        try {

            const response = await axiosInstance.post(
                "/users/register",
                data
            );

            toast.success(response?.data?.message || "Account created", { id: "register-success" });

            return response.data;

        } catch (err) {

            toast.error(
                err?.response?.data?.message || "Something went wrong",
                { id: "register-error" }
            );

            return thunkAPI.rejectWithValue(
                err?.response?.data
            );
        }
    }
);

// ================= LOGIN =================

export const login = createAsyncThunk(
    "/auth/login",

    async (data, thunkAPI) => {

        try {

            const response = await axiosInstance.post(
                "/auth/login",
                data
            );

            toast.success(response?.data?.message || "Logged in", { id: "auth-success" });

            // ONLY RETURN SERIALIZABLE DATA
            return response.data;

        } catch (err) {

            toast.error(
                err?.response?.data?.message || "Something went wrong",
                { id: "auth-error" }
            );

            return thunkAPI.rejectWithValue(
                err?.response?.data
            );
        }
    }
);

// ================= LOGOUT =================

export const logout = createAsyncThunk(
    "/auth/logout",

    async (_, thunkAPI) => {

        try {

            const response = await axiosInstance.post(
                "/auth/logout"
            );

            toast.success(response?.data?.message || "Logged out", { id: "auth-success" });

            return response.data;

        } catch (err) {

            // Even if the request fails (offline / cold start) we still clear
            // local state below — the user asked to log out.
            return thunkAPI.rejectWithValue(
                err?.response?.data
            );
        }
    }
);

// ================= SLICE =================

function clearAuthState(state) {
    state.isLoggedIn = false;
    state.role = "";
    state.data = {};
    localStorage.removeItem("data");
    localStorage.removeItem("token");
}

const AuthSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {
        // Used by the axios 401 interceptor (via App.jsx event listener) —
        // wipes local auth state without calling the API.
        forceLogout: (state) => {
            clearAuthState(state);
        },
    },

    extraReducers: (builder) => {

        builder

        // ================= VERIFY =================

        .addCase(verifyAuth.fulfilled, (state, action) => {
            state.isLoggedIn = true;
            state.authChecked = true;
            state.role = action?.payload?.data?.role || "";
            // Merge keeps cached firstName — /auth/verify only returns { id, email, role }
            state.data = { ...state.data, ...(action?.payload?.data || {}) };
        })

        .addCase(verifyAuth.rejected, (state) => {
            clearAuthState(state);
            state.authChecked = true;
        })

        // ================= LOGIN SUCCESS =================

        .addCase(login.fulfilled, (state, action) => {

            state.isLoggedIn = true;

            state.role = action?.payload?.data?.role || "";

            state.data = action?.payload?.data?.userData || {};

            // Save token for cross-domain Authorization header fallback
            if (action?.payload?.token) {
                localStorage.setItem('token', action.payload.token);
            }

            // DISPLAY-ONLY CACHE (survives refresh for navbar name/avatar)
            localStorage.setItem(
                'data',
                JSON.stringify(state.data)
            );
        })

        // ================= LOGOUT (success OR failure → clear locally) =================

        .addCase(logout.fulfilled, (state) => {
            clearAuthState(state);
        })

        .addCase(logout.rejected, (state) => {
            clearAuthState(state);
        });
    }
});

export const { forceLogout } = AuthSlice.actions;

export default AuthSlice.reducer;