import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    cartsData: {
        items: []
    },
};

// ================= ADD PRODUCT =================

export const addProductToCart = createAsyncThunk(
    "/cart/addproduct",

    async (productId, thunkAPI) => {

        try {

            const response = axiosInstance.post(
                `/user/cart/add/${productId}`
            );

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error(error?.response?.data?.message || "Failed to add product");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= REMOVE PRODUCT =================

export const removeProductFromCart = createAsyncThunk(
    "/cart/removeproduct",

    async (productId, thunkAPI) => {

        try {

            const response = axiosInstance.post(
                `/user/cart/remove/${productId}`
            );

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error(error?.response?.data?.message || "Failed to remove product");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= GET CART =================

export const getCartDetails = createAsyncThunk(
    "/cart/getDetails",

    async (_, thunkAPI) => {

        try {

            const response = axiosInstance.get(
                `/user/cart`
            );

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            console.log(error?.response);

            if (error?.response?.status === 401) {

                return thunkAPI.rejectWithValue({
                    isUnauthorized: true
                });
            }

            toast.error(error?.response?.data?.message || "Failed to fetch cart");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= CLEAR CART =================

export const clearCart = createAsyncThunk(
    "/cart/clear",

    async (_, thunkAPI) => {

        try {

            const response = axiosInstance.delete(
                `/user/cart/clear`
            );

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            console.log(error?.response);

            toast.error(error?.response?.data?.message || "Failed to clear cart");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= SLICE =================

const cartslice = createSlice({
    name: 'cart',

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        .addCase(addProductToCart.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data;
        })

        .addCase(removeProductFromCart.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data;
        })

        .addCase(getCartDetails.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data || { items: [] };
        })

        .addCase(getCartDetails.rejected,
            (state, action) => {

            if (action?.payload?.isUnauthorized) {
                state.cartsData = { items: [] };
            }
        })

        .addCase(clearCart.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data || { items: [] };
        });
    }
});

export default cartslice.reducer;
