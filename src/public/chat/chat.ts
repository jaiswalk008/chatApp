// const activeUserBtn = document.getElementById('active-user') as HTMLButtonElement;
// console.log(activeUserBtn);
// activeUserBtn.addEventListener('click',showActiveUsers);
declare var axios:any;
const token:string = localStorage.getItem('token');
const username:string = localStorage.getItem('username');
const chatContainer = document.querySelector('.chat') as HTMLElement;
const messageForm = document.querySelector('.send-message') as HTMLFormElement;
const groupBtn= document.querySelector('.active') as HTMLButtonElement;
messageForm.addEventListener('submit',sendMessage);

async function sendMessage(e:Event){
    e.preventDefault();
    
    
    const formElement = e.target as HTMLFormElement;
    const chatMessage = {
        message:formElement.message.value,
        groupId: groupBtn.id
        
    };
    console.log(chatMessage);
    try {
        const res = await axios.post('http://localhost:4000/sendMessage',chatMessage,{
            headers:{Authorization:token}
        });
        // showMessage([res.data.message , username]);
        messageForm.reset();
    } catch (error) {
        console.log(error);
    }

}
function showMessage(){
    chatContainer.innerHTML='';
    const storedMessageArray = localStorage.getItem('messageArray');
    if(storedMessageArray){
        const parsedMessageArray = JSON.parse(storedMessageArray) as [string, string,string][];
        parsedMessageArray.filter(element =>{
            const newDiv = document.createElement('div');
            let classname="message";
            if(element[2]==username) {
                classname = "my-message";
                element[2]="you";
            }
            newDiv.innerHTML=`<p class="${classname}">${element[2]}: ${element[1]}</p>`;
            chatContainer.appendChild(newDiv);
        })

    }

}

function start(){
    let lastMessageId= -1;
    const messageArray:Array<[string,string,string]>=[];
    setInterval(async function getMessages(){
        try {
            const res = await axios.get(`http://localhost:4000/getMessages?lastMessageId=${lastMessageId}&groupId=${groupBtn.id}`);
            // console.log(res.data.messages);
            // lastMessageId = res.data.messages.At(-1).id;
            
            res.data.messages.filter((element: any) => {
                // showMessage([element.content, element.user.username]);
                lastMessageId = element.id;
                messageArray.push([element.id,element.content, element.user.username])
                
            });      
            while(messageArray.length>10) messageArray.shift();
            localStorage.setItem('messageArray',JSON.stringify(messageArray));
            showMessage();

        } catch (error) {
            console.log(error);
        }
    },1000);
}
window.addEventListener('DOMContentLoaded', () =>{
    start();
    
}) 