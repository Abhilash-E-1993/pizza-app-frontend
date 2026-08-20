import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    productsData: [],
    productsLoading: false,
    productsLoaded: false, // cache flag — don't refetch on every menu visit
};

// ================= GET ALL PRODUCTS =================

export const getAllProducts = createAsyncThunk(
    "/products/getAll",

    async (_, thunkAPI) => {

        try {

            const apiResponse = await axiosInstance.get('/products');

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Failed to load products",
                { id: "products-error" }
            );

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

            const apiResponse = await axiosInstance.get(
                `/products/${id}`
            );

            return apiResponse.data;

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Failed to load product details",
                { id: "product-details-error" }
            );

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

        .addCase(getAllProducts.pending, (state) => {
            state.productsLoading = true;
        })

        .addCase(getAllProducts.fulfilled, (state, action) => {

            state.productsData =
                action?.payload?.data || [];

            state.productsLoading = false;
            state.productsLoaded = true;
        })

        .addCase(getAllProducts.rejected, (state) => {

            state.productsData = [];
            state.productsLoading = false;
        });
    }
});

export default productSlice.reducer;