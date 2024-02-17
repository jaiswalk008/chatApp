import { useCallback, useState } from "react";
import Input from "../UI/Input";
import './User.css';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import Header from "../UI/Header";
const Signup = () =>{

    const [userName,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [errorMessage , setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const userNameChangeHandler = (event:any) => setUserName(event.target.value);
    const emailChangeHandler = (event:any) => setEmail(event.target.value);
    const passwordChangeHandler = (event:any) => setPassword(event.target.value);
    const confirmPasswordChangeHandler = (event:any) => setConfirmPassword(event.target.value);

    const formSubmitHandler =useCallback( async (e:any) =>{
        e.preventDefault();
        const userDetails:{userName:string, email:string,password:string} = {
            userName, email,password
        }
        if(password !== confirmPassword){
            setErrorMessage("Passwords do not match");
            return;
        }
        try{
            await axios.post('http://localhost:5000/signup',userDetails);
            navigate('/login');
        }
        catch(err:any){
            console.log(err)
            setErrorMessage(err.response.data.message);
        }
      
    },[userName,email,password,confirmPassword,navigate])
    return (
       <>
            
            <Header />
            <div className='container'>
                <div className='form-container'>
                    <h3>Signup</h3>
                    
                    {errorMessage.length>0 && <p className="message">{errorMessage}</p>}
                    <form onSubmit={formSubmitHandler}>
                        <Input id="username" value={userName} label="UserName" type="text" onChange={userNameChangeHandler} />
                        <Input id="email" value={email} label="Email" type="email" onChange={emailChangeHandler} />
                        <Input id="password" value={password} label="Password" type="password" onChange={passwordChangeHandler} />
                        <Input id="confirmPassword" value={confirmPassword} label="Confirm Password" type="password" onChange={confirmPasswordChangeHandler} />
                        <button className="btn mt-2 w-100 btn-primary">Signup</button>
                    </form>
                    <span>Already have an account? <Link to="/login"> Login</Link></span>
                </div>
            </div>
       </>
    )
}
export default Signup;