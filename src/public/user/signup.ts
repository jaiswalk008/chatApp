
const signupForm = document.querySelector('.form') as HTMLFormElement;
signupForm.addEventListener('submit',signup);
declare var axios: any;

interface UserInterface{
    username:string;
    email:string;
    phone:number;
    password:string; 
}

async function signup(e: Event){
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;

    const userDetails: UserInterface = {
        username:formElement.username.value,
        email:formElement.email.value,
        phone:parseInt(formElement.phone.value),
        password:formElement.password.value
    }
    try{
        const res=await axios.post('http://localhost:4000/'+'signup',userDetails);
        console.log(res.data.userDetails);
        signupForm.reset();
        window.location.replace('login.html')
    }
    catch(err:any){
        console.log(err);
        const message = err.response.data.message;
        const messageHeader = document.querySelector('.message') as HTMLHeadingElement;
        
        messageHeader.innerText=message;
        messageHeader.style.display='block';
        
    }
    
}