import React, { Suspense, lazy } from 'react';
import './App.css';

import {createBrowserRouter , RouterProvider , Outlet } from 'react-router-dom';
// import Mail from './Components/Mail/Mail';
import {useSelector} from 'react-redux';
import Home from './Components/Chat/Home';

function App() {
  const {token} = useSelector((state:any) => state.auth);

  
  return (
    <>
    <Home/>
    </>
  );
}


export default App;