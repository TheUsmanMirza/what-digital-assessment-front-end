import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './features/authSlice';
import ProductReducer from './features/productSlice'


export default configureStore({
    reducer: {
        auth: AuthReducer,
        product: ProductReducer
    },
})