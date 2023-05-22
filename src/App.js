import './App.css';
import { useDispatch} from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { Suspense, useEffect } from 'react';
import { setUser } from './redux/features/authSlice';
import SignInView from '../src/components/ui/auth/signin/signInView'
import Dashboard from './components/ui/dashboard/dashboard';

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    dispatch(setUser(user));
  });

  return (
    <Suspense>
      <ToastContainer />
      <Routes>
        <Route path='/' name='Login Page' element={<SignInView />} />
        <Route path='/dashboard' name='Dashboard' element={localStorage.getItem("profile")?<Dashboard />:<SignInView/>} />
      </Routes>
    </Suspense>
  );
}

export default App;
