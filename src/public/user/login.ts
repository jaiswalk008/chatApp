
const loginForm = document.querySelector('.form') as HTMLFormElement;

loginForm.addEventListener('submit',login);
declare var axios:any;
const url2='http://localhost:4000/';

async function login(e:Event){
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const loginDetails :{email:string , password:string}= {
        email:formElement.email.value,
        password:formElement.password.value
    }
    console.log(loginDetails);
    try {
        const res = await axios.post(url2+'login',loginDetails);
        console.log(res.data);
        localStorage.setItem('username',res.data.username);
        localStorage.setItem('token',res.data.token);
        loginForm.reset();
        window.location.replace('/dist/public/chat/chatUI.html')
    } catch (err:any) {
        console.log(err)
        const message = err.response.data.message;
        const messageHeader = document.querySelector('.message') as HTMLHeadingElement;
        messageHeader.innerText=message;
        messageHeader.style.display='block';
    }

}

