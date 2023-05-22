import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as  api from "../api";
import { toast, ToastContainer } from 'react-toastify';


export const login = createAsyncThunk("signin", async ({inputValue, navigate}, { rejectWithValue }) => {
    try {
        const response = await api.signin(inputValue);
        toast.success("Login Successfully");
        navigate("/dashboard");
        return response;
    } catch (error) {
        toast.error(error.response.data);
        console.log(error.response.data);
        return rejectWithValue(error.response.data);
    }

})


const authSlice = createSlice({
    name: "auth",
    initialState: {
        resetLink: {},
        user: null,
        user_email: "",
        error: "",
        loading: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLogout: (state, action) => {
            localStorage.clear();
            sessionStorage.clear();
            state.user = null;
            

        }
    },
    extraReducers: {
        [login.pending]: (state, action) => {
            state.loading = true
        },
        [login.fulfilled]: (state, action) => {
            state.loading = false;
            console.log(localStorage.getItem('profile'));
            localStorage.setItem("user_email", action.payload.data?.email);
            localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
            state.user = action.payload
        },
        [login.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
    }
});


export const { setUser, setLogout } = authSlice.actions
export default authSlice.reducer