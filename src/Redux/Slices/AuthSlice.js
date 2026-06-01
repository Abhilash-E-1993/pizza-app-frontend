import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

// SAFE LOCAL STORAGE
const storedData = localStorage.getItem('data');

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: localStorage.getItem('role') || '',
    token: localStorage.getItem('token') || '',
    data: storedData ? JSON.parse(storedData) : {},
};

// ================= CREATE ACCOUNT =================

export const createAccount = createAsyncThunk(
    "/auth/createAccount",

    async (data, thunkAPI) => {

        try {

            const response = await axiosInstance.post(
                "/users/register",
                data
            );

            toast.success(response?.data?.message);

            return response.data;

        } catch (err) {

            toast.error(
                err?.response?.data?.message || "Something went wrong"
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

            toast.success(response?.data?.message);

            // ONLY RETURN SERIALIZABLE DATA
            return response.data;

        } catch (err) {

            toast.error(
                err?.response?.data?.message || "Something went wrong"
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

            toast.success(response?.data?.message);

            return response.data;

        } catch (err) {

            toast.error(
                err?.response?.data?.message || "Something went wrong"
            );

            return thunkAPI.rejectWithValue(
                err?.response?.data
            );
        }
    }
);

// ================= SLICE =================

const AuthSlice = createSlice({
    name: 'auth',

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        // ================= LOGIN SUCCESS =================

        .addCase(login.fulfilled, (state, action) => {

            state.isLoggedIn = true;

            state.role = action?.payload?.data?.role;

            state.data = action?.payload?.data?.userData;

            const token = action?.payload?.token || action?.payload?.data?.token || '';
            state.token = token;

            // STORE IN LOCAL STORAGE

            localStorage.setItem(
                'isLoggedIn',
                'true'
            );

            localStorage.setItem(
                'role',
                action?.payload?.data?.role || ''
            );

            localStorage.setItem(
                'data',
                JSON.stringify(
                    action?.payload?.data?.userData || {}
                )
            );

            if (token) {
                localStorage.setItem('token', token);
            }
        })

        // ================= LOGOUT SUCCESS =================

        .addCase(logout.fulfilled, (state) => {

            localStorage.setItem(
                'isLoggedIn',
                'false'
            );

            localStorage.setItem(
                'role',
                ''
            );

            localStorage.setItem(
                'token',
                ''
            );

            localStorage.setItem(
                'data',
                JSON.stringify({})
            );

            state.isLoggedIn = false;

            state.role = '';

            state.token = '';

            state.data = {};
        });
    }
});

export default AuthSlice.reducer;