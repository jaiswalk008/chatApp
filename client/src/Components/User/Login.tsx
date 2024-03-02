import { useCallback, useState } from "react";

import Input from "../UI/Input";
import './User.css';
import axios from "axios";
import { useDispatch } from "react-redux";
import {authActions} from '../Context/store';
import {Link, useNavigate} from 'react-router-dom';
import Header from "../UI/Header";
const Login = () => {
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [errorMessage , setErrorMessage] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const emailChangeHandler = (event:any) => setEmail(event.target.value);
    const passwordChangeHandler = (event:any) => setPassword(event.target.value);

    const formSubmitHandler = useCallback(async (e:any) =>{
        e.preventDefault();
        const userDetails :{email:string,password:string} = {
            email:email,
            password:password,
        }
        // console.log(userDetails);
        try{
            const res = await axios.post('http://localhost:5000/login',userDetails);
            // console.log(res.data);
            dispatch(authActions.addToken(res.data.token));
            localStorage.setItem('username',res.data.username);
            navigate('/');
        }
        catch(err:any){
            // console.log(err);
            setErrorMessage(err.response.data.message);
        }

    },[email,password,navigate,dispatch])
    return (
        <>
            <Header/>
            <div className="container p-2 mt-5 d-flex flex-column align-content-center ">
                {errorMessage.length>0  && <div className="message">{errorMessage}</div>}
                <form onSubmit={formSubmitHandler} className="form p-2 m-2">
                    <Input id="email" value={email} label="Email" type="email" onChange={emailChangeHandler} />
                    
                    <Input id="password" value={password} label="Password" type="password" onChange={passwordChangeHandler} />
                    <button type="submit" className="btn w-100 mt-3" >Login</button>
                </form>
                
                <div className="text-center">Don't have an account? <Link className="mt-3" to="/signup">Signup</Link></div>
            </div>
        </>
    )
}
export default Login;