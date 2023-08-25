// const activeUserBtn = document.getElementById('active-user') as HTMLButtonElement;
// console.log(activeUserBtn);
// activeUserBtn.addEventListener('click',showActiveUsers);
declare var axios:any;
const token:string = localStorage.getItem('token');
const username:string = localStorage.getItem('username');
const chatContainer = document.querySelector('.chat') as HTMLElement;
const messageForm = document.querySelector('.send-message') as HTMLFormElement;
async function showUsersList(){
    try {
        const res = await axios.get('http://localhost:4000/getUsers');
        console.log(res.data.userList);
    } catch (error) {
        console.log(error);
    }

}

messageForm.addEventListener('submit',sendMessage);

async function sendMessage(e:Event){
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const chatMessage = {
        message:formElement.message.value
    };
    console.log(chatMessage);
    try {
        const res = await axios.post('http://localhost:4000/sendMessage',chatMessage,{
            headers:{Authorization:token}
        });
        showMessage([res.data.message , username]);
        messageForm.reset();
    } catch (error) {
        console.log(error);
    }

}
function showMessage(data:Array<string>){
    const newDiv = document.createElement('div');
    let classname="message";
    if(data[1]==username) {
        classname = "my-message";
        data[1]="you";
    }
    newDiv.innerHTML=`<p class="${classname}">${data[1]}: ${data[0]}</p>`;
    chatContainer.appendChild(newDiv);

}
function start(){
    setInterval(async function getMessages(){
        try {
            const res = await axios.get('http://localhost:4000/getMessages');
            // console.log(res.data.messages);
            chatContainer.innerHTML='';
            res.data.messages.filter((element: any) => {
                showMessage([element.content, element.user.username]);
                
            });        
            
        } catch (error) {
            console.log(error);
        }
    },1000);
}
window.addEventListener('DOMContentLoaded', () =>{
    start();
})