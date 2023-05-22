import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:2000/" });

API.interceptors.request.use((req) => {
    debugger;
    if (localStorage.getItem("profile")) {

        const data = JSON.parse(localStorage.profile);
        const access_token = data.data.access;
        req.headers.Authorization = `Bearer ${access_token}`;
    }
    return req;
})

export const signin = (formData) => API.post("api/signin/", formData);
export const getproduct = (product_name) => API.get(`api/product/?product_name=${product_name}`);