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

            const apiResponse = await axiosInstance.post(
                `/user/cart/add/${productId}`
            );

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Failed to add product",
                { id: `add-${productId}` }
            );

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

            const apiResponse = await axiosInstance.post(
                `/user/cart/remove/${productId}`
            );

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Failed to remove product",
                { id: `remove-${productId}` }
            );

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

            const apiResponse = await axiosInstance.get(
                `/user/cart/`
            );

            return apiResponse.data;

        } catch (error) {

            // 401 is handled globally by the axios interceptor — stay quiet here.
            if (error?.response?.status !== 401) {
                toast.error(
                    error?.response?.data?.message || "Failed to fetch cart",
                    { id: "cart-error" }
                );
            }

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

            const apiResponse = await axiosInstance.delete(
                `/user/cart/clear`
            );

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Failed to clear cart",
                { id: "cart-error" }
            );

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

    reducers: {
        // The backend clears the cart after a successful order — mirror that
        // locally without firing an extra network request.
        emptyCartLocal: (state) => {
            state.cartsData = { items: [] };
        },
    },

    extraReducers: (builder) => {

        builder

        .addCase(addProductToCart.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data || { items: [] };
        })

        .addCase(removeProductFromCart.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data || { items: [] };
        })

        .addCase(getCartDetails.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data || { items: [] };
        })

        .addCase(clearCart.fulfilled,
            (state, action) => {

            state.cartsData =
                action?.payload?.data || { items: [] };
        });
    }
});

export const { emptyCartLocal } = cartslice.actions;

export default cartslice.reducer;