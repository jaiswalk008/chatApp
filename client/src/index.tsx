import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Signup from './Components/User/Signup';
import Login from './Components/User/Login';
import {createBrowserRouter, RouterProvider}  from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './Components/Context/store';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLDivElement
);
const appRouter = createBrowserRouter([
  {
    path:'/', 
    element:<App/>,
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>,
  },
 
])
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router ={appRouter}/>
    </Provider>
  </React.StrictMode>
);

