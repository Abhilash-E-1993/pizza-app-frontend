import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    productsData: [],
};

// ================= GET ALL PRODUCTS =================

export const getAllProducts = createAsyncThunk(
    "/products/getAll",

    async (_, thunkAPI) => {

        try {

            const products = axiosInstance.get('/products');

            const apiResponse = await products;

            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error("Failed to load products");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= PRODUCT DETAILS =================

export const productDetails = createAsyncThunk(
    "/products/getDetails",

    async (id, thunkAPI) => {

        try {

            const product = axiosInstance.get(
                `/products/${id}`
            );

            const apiResponse = await product;

            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error("Failed to load product details");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= SLICE =================

const productSlice = createSlice({
    name: 'product',

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        .addCase(getAllProducts.fulfilled, (state, action) => {

            console.log(action.payload);

            state.productsData =
                action?.payload?.data || [];
        })

        .addCase(getAllProducts.rejected, (state) => {

            state.productsData = [];
        });
    }
});

export default productSlice.reducer;