import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    AddedProducts: [],
};

// ================= ADD PRODUCT (ADMIN) =================
// 401/403 are handled globally by the axios interceptor (single toast +
// redirect) — here we only surface the operation result via toast.promise.

export const AddProducts = createAsyncThunk(
    "/add/products",

    async (data, thunkAPI) => {

        try {

            const response = axiosInstance.post(
                '/products/create',
                data
            );

            toast.promise(response, {
                loading: "Adding product...",
                success: "Product added successfully",
                error: (err) => err?.response?.data?.message || "Product not added",
            }, { id: "add-product" });

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= DELETE PRODUCT (ADMIN) =================

export const deleteProductById = createAsyncThunk(
    "/delete/product",

    async (productId, thunkAPI) => {

        try {

            const response = axiosInstance.delete(
                `/products/delete/${productId}`
            );

            toast.promise(response, {
                loading: "Deleting product...",
                success: "Product deleted successfully",
                error: (err) => err?.response?.data?.message || "Product not deleted",
            }, { id: "delete-product" });

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= SLICE =================

const AddproductSlice = createSlice({
    name: 'Addproduct',

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

        .addCase(AddProducts.fulfilled,
            (state, action) => {

            state.AddedProducts =
                action?.payload?.data || [];
        })

        .addCase(deleteProductById.fulfilled,
            (state, action) => {

            state.AddedProducts =
                action?.payload?.data || state.AddedProducts;
        });
    }
});

export default AddproductSlice.reducer;