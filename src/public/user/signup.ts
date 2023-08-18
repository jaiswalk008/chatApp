
const form = document.querySelector('.form') as HTMLFormElement;
form.addEventListener('submit',signup);

declare const axios: any;
const url='http://localhost:4000/';
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
        const res=await axios.post(url+'addUser',userDetails);
        console.log(res.data.userDetails);
        form.reset();
        alert('Successfuly signed up');
    }
    catch(err:any){
        const message = err.response.data.message;
        const messageHeader = document.querySelector('.message') as HTMLHeadingElement;
        
        messageHeader.innerText=message;
        messageHeader.style.display='block';
        
    }
    
}