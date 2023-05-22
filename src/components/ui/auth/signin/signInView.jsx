import React from "react";
import { InputField } from '../../../uitls/common/textfields'
import { useNavigate } from 'react-router-dom';
import './signin.css'
import { useState } from "react"
import { useDispatch } from 'react-redux';
import {login} from '../../../../redux/features/authSlice'

export default function SignInView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({ email: "", password: "" });
    const { email, password } = inputValue;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((previous_state) => ({
            ...previous_state,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            dispatch(login({inputValue, navigate}))
        }
    };



    return (
        <div className="App-header" style={{"justify-content": "center"}}>
            <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-lg-4 form_class">
                    <div className="container-fluid">
                    <div className="d-flex justify-content-center"><h1>Welcome</h1></div>
                        <InputField value={email} name="email" type="text" label={"Email Address"} placeholder="example@gmail.com" onChange={handleChange} />
                        <InputField value={password} name="password" type="password" label={"Password"} placeholder="Password" onChange={handleChange} />
                        <button type="button" class="btn btn-primary" onClick={handleSubmit}>Login to Continue</button>
                    </div>

                </div>
            </div>
            </div>
        </div>
    );
} 