import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    ordersdata: [],
    ordersLoading: false,
    ordersLoaded: false,
};

// ================= PLACE ORDER =================
// Backend creates the order from the cart AND clears the cart server-side.

export const PlaceOrder = createAsyncThunk(
    "/order/place",

    async (data, thunkAPI) => {

        try {

            const apiResponse = await axiosInstance.post(
                `/user/`,
                data
            );

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Failed to place order",
                { id: "place-order-error" }
            );

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= GET MY ORDERS =================
// NOTE: an empty list comes back as 200 + [] — that is NOT an error.

export const getAllOrders = createAsyncThunk(
    "/order/getAll",

    async (_, thunkAPI) => {

        try {

            const apiResponse = await axiosInstance.get(`/user/`);

            return apiResponse.data;

        } catch (error) {

            if (error?.response?.status !== 401) {
                toast.error(
                    error?.response?.data?.message || "Failed to load orders",
                    { id: "orders-error" }
                );
            }

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= CANCEL ORDER =================

export const cancelOrder = createAsyncThunk(
    "/order/cancel",

    async (orderId, thunkAPI) => {

        try {

            const apiResponse = await axiosInstance.patch(
                `/user/${orderId}/status`,
                { status: "CANCELLED" }
            );

            toast.success("Order cancelled", { id: `cancel-${orderId}` });

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Could not cancel order",
                { id: `cancel-${orderId}` }
            );

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= SLICE =================

const OrderSlice = createSlice({
    name: 'order',

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        .addCase(getAllOrders.pending, (state) => {
            state.ordersLoading = true;
        })

        .addCase(getAllOrders.fulfilled, (state, action) => {
            state.ordersdata = action?.payload?.data || [];
            state.ordersLoading = false;
            state.ordersLoaded = true;
        })

        .addCase(getAllOrders.rejected, (state) => {
            state.ordersLoading = false;
        })

        .addCase(cancelOrder.fulfilled, (state, action) => {
            const updated = action?.payload?.data;
            if (!updated?._id) return;
            state.ordersdata = state.ordersdata.map((order) =>
                order._id === updated._id ? { ...order, ...updated } : order
            );
        });
    }
});

export default OrderSlice.reducer;