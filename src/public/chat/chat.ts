// const activeUserBtn = document.getElementById('active-user') as HTMLButtonElement;
// console.log(activeUserBtn);
// activeUserBtn.addEventListener('click',showActiveUsers);
declare var axios:any;
const token:string = localStorage.getItem('token');
const username:string = localStorage.getItem('username');

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
        showMessage(res.data.message);
        messageForm.reset();
    } catch (error) {
        console.log(error);
    }

}
function showMessage(text:string){
    console.log(text);
}