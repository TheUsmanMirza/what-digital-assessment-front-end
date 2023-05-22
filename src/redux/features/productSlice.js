import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as  api from "../api";

let allproducts = null;

const initialState = {
    products: [],
}
export const getproductbyId = createAsyncThunk("product", async (product_name, { rejectWithValue }) => {
    try {
        allproducts = null;
        const response = await api.getproduct(product_name);
        allproducts = response.data
        return response.data;
    }
    catch (error) {
        if(error.response.status === 401){
            // navigate('/logout')
        }
        return rejectWithValue(error.response.data)
    }
})


const productSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: {
        [getproductbyId.pending]: (state) => {
            state.loading = true
        },
        [getproductbyId.fulfilled]: (state) => {
            state.loading = false;
            debugger;
            localStorage.setItem("allproduct", JSON.stringify(allproducts));
            state.products = allproducts
        },
        [getproductbyId.rejected]: (state, action) => {
            state.loading = false;
            debugger;
            state.error = action.payload
            state.products = allproducts
            localStorage.setItem("allproduct", JSON.stringify(allproducts));
        },
    }
});

export default productSlice.reducer