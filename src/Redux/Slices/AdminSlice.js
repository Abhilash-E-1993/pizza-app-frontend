import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    AddedProducts: [],
};

// ================= ADD PRODUCT =================

export const AddProducts = createAsyncThunk(
    "/add/products",

    async (data, thunkAPI) => {

        try {

            console.log("incoming data", data);

            const response = axiosInstance.post(
                '/products/create',
                data
            );

            toast.promise(response, {
                loading: "Adding product...",
                error: 'Product not added',
                success: 'Product added successfully'
            });

            const apiResponse = await response;

            // IMPORTANT FIX
            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error("Product not added");

            return thunkAPI.rejectWithValue(
                error?.response?.data
            );
        }
    }
);

// ================= DELETE PRODUCT =================

export const deleteProductById = createAsyncThunk(
    "/delete/product",

    async (productId, thunkAPI) => {

        try {

            const response = axiosInstance.delete(
                `/products/delete/${productId}`
            );

            toast.promise(response, {
                loading: "Deleting product...",
                error: 'Product not deleted',
                success: 'Product deleted successfully'
            });

            const apiResponse = await response;

            return apiResponse.data;

        } catch (error) {

            console.log(error);

            toast.error("Product not deleted");

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