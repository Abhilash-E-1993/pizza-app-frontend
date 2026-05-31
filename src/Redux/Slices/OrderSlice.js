import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    ordersdata: null
};

// ================= PLACE ORDER =================

export const PlaceOrder = createAsyncThunk(
    "/order/place",

    async (data, thunkAPI) => {

        try {

            const response = axiosInstance.post(
                `/user/`,
                data
            );

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error(error?.response?.data?.message || "Failed to place order");

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

        .addCase(PlaceOrder.fulfilled,
            (state, action) => {

            state.ordersdata =
                action?.payload?.data;
        });
    }
});

export default OrderSlice.reducer;
