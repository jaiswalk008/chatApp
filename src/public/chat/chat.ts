
declare var axios:any;
const token:string = localStorage.getItem('token');
const username:string = localStorage.getItem('username');
const chatContainer = document.querySelector('.chat') as HTMLElement;
const messageForm = document.querySelector('.send-message') as HTMLFormElement;
const userList = document.querySelector('.user-list') as HTMLUListElement;
const chatList= document.querySelector('.class-list') as HTMLDivElement;
const error = document.querySelector('.alert') as HTMLParagraphElement;
const groupInfo = document.querySelector('.group-info') as HTMLDivElement;
// const groupBtn= document.querySelector('.active') as HTMLButtonElement;
messageForm.addEventListener('submit',sendMessage);

//function for sending message
async function sendMessage(e:Event){
    e.preventDefault();
    const groupBtn= document.querySelector('.active') as HTMLButtonElement;
    
    const formElement = e.target as HTMLFormElement;
    const chatMessage = {
        message:formElement.message.value,
        groupId: groupBtn.id
        
    };
    // console.log(chatMessage);
    try {
        const res = await axios.post('http://13.235.45.170:4000/sendMessage',chatMessage,{
            headers:{Authorization:token}
        });
        // showMessage([res.data.message , username]);
        messageForm.reset();
    } catch (error) {
        console.log(error);
    }

}
//function for showing message on chat
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
let intervalId:any = null;

//function for getting chat messages
function start(groupId:string){
    // console.log(groupId);
    let lastMessageId= -1; 
    
    const messageArray:Array<[string,string,string]>=[];
    //clearing interval id so that the function is not getting called with older ids
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(async function getMessages(){
        try {
            // console.log(groupId);
            const res = await axios.get(`http://13.235.45.170:4000/getMessages?lastMessageId=${lastMessageId}&groupId=${groupId}`);
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

window.addEventListener('DOMContentLoaded',async () =>{
    try{
        const res = await axios.get('http://13.235.45.170:4000/getGroups',{headers:{Authorization:token}});

        res.data.groupIds.filter((element:any,index:number)=>{
            displayGroup(element.groupId,res.data.groupNames[index]);
        })
       
        const element = chatList.firstElementChild.nextSibling as HTMLButtonElement;
        changeActiveBtn(element.id);
        if(element) element.className="btn active";
        
        start(element.id);
    }
    catch(err) {console.log(err);}
    
}) 
//function for creating groups
async function createGroup(){
    try {
        const res = await axios.get('http://13.235.45.170:4000/getUsers');
        userList.innerHTML='';
        res.data.userList.filter((element:any)=> {
            if(element.username!=username) showUserList([element.id, element.username])
        })
    } catch (error) {
        console.log(error);
    }
}
//function for showing user list when creating a group
function showUserList(userData:[number,string]){
    
    const newLi = document.createElement('li');
    newLi.innerHTML=`<input type="checkbox" id="${userData[0]}" name="${userData[1]}" value="${userData[1]}">
    <label for="${userData[0]}" class="form-label"> ${userData[1]}</label><br>`
    userList.appendChild(newLi);
}
//function for creating the group
async function addNewGroup(e:Event){
    
    const groupNameInput  = document.getElementById('groupname') as HTMLInputElement;
    const groupName = groupNameInput.value;
    if(!groupName.length){
        
        error.style.display = 'block';
    }
    else{
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const checkedValues = Array.from(checkboxes).map((checkbox:any) => parseInt(checkbox.id));
        // console.log(checkedValues);
        const closeBtn = document.getElementById('close') as HTMLButtonElement;
        closeBtn.click();
        const data={
            groupName:groupName,
            userIds:checkedValues
        }
        
        // got the ids now and also do incliude the users id as well
        // send the userId along with the geoup name to backend
        try{
            const res =await axios.post('http://13.235.45.170:4000/createGroup',data,{
            headers:{Authorization:token}
            });
            // console.log(res.data);
            const currActiveBtn  = document.querySelector('.active') as HTMLButtonElement;
            if(currActiveBtn) currActiveBtn.className='btn';
            displayGroup(res.data.groupId, res.data.groupName);
            const element = chatList.firstElementChild.nextSibling as HTMLButtonElement;
            element.className="btn active";
            groupNameInput.value='';
        }
        catch(err){console.log(err);}
    }
    
}

//function for displaying groupname in the chat list
//Note: The groups which the user is a part of will be visible to the user
function displayGroup(id:string, groupName:string){
    const grpBtn = document.createElement('button');
    
    grpBtn.className='btn';
    grpBtn.id= id;
    grpBtn.innerText=groupName;
    grpBtn.addEventListener('click',() => changeGroup(grpBtn.id ,groupName));
    error.style.display = 'none';

    const chatName = document.querySelector('.chat-name') as HTMLDivElement;
    chatName.innerHTML =`<i class="bi bi-people-fill"> </i><span id="${grpBtn.id}">${groupName}</span>`;
    
    chatList.insertBefore(grpBtn,chatList.firstElementChild.nextSibling);
}
//function for switching chats
function changeGroup(id:string,groupName:string){
    changeActiveBtn(id);
    groupInfo.style.display='none';
    // console.log(id);
    const btn = document.getElementById(id) as HTMLButtonElement;
    btn.className='btn active';
    const chatName = document.querySelector('.chat-name') as HTMLDivElement;
    chatName.innerHTML =`<i class="bi bi-people-fill"> </i><span id="${id}">${groupName}</span>`;
    start(id);
    localStorage.removeItem('messageArray');
} 

function changeActiveBtn(groupId:string){
    const currActiveBtn  = document.querySelector('.active') as HTMLButtonElement;
    if(currActiveBtn) currActiveBtn.className='btn';
    localStorage.setItem('groupId',groupId);
}


const chatHead = document.querySelector('.chat-name') as HTMLDivElement;

chatHead.addEventListener('click',async()=>{
    
   
    groupInfo.style.display='block';
    const groupSpan = chatHead.firstElementChild.nextElementSibling;
    const groupId= groupSpan.id;
    const groupName = groupSpan.innerHTML;
    const memberListContainer = document.querySelector('.member-list') as HTMLDivElement;
    memberListContainer.innerHTML='';
    // console.log(groupName);
    const getMembers = await axios.get('http://13.235.45.170:4000/getMembers?groupId='+groupId);
    const groupNameDisplay = document.querySelector('.groupname') as HTMLParagraphElement;
    groupNameDisplay.innerText=groupName;
    console.log(getMembers.data.userIds);
    let ind = getMembers.data.userNames.indexOf(username);
    let flag =false;
    if(getMembers.data.userIds[ind].admin) flag=true;
    getMembers.data.userIds.filter((userInfo:{userId:string,admin:boolean},index:number)=>{
        let text='';
        const memberInfo = document.createElement('h5');
        text= userInfo.admin? "admin": "Make admin";
        let display='';
        if(index==ind) display='d-none';
        if(flag){
            memberInfo.innerHTML=
            `${getMembers.data.userNames[index]} <i onClick="removeUser(this,${userInfo.userId},${groupId})" class="bi bi-x fs-3 text-danger ${display}"></i> <button class="btn btn-danger" id="admin${userInfo.userId}" onClick="makeAdmin(${userInfo.userId},${groupId})">${text}</button>`
        }
        else{
            if(text=="admin") memberInfo.innerHTML=
            `${getMembers.data.userNames[index]} <button class="btn btn-danger" >${text}</button>`
            else {
                memberInfo.innerHTML=`${getMembers.data.userNames[index]}`
            }
        }
       
        memberListContainer.appendChild(memberInfo);
    })
  
}) 
async function removeUser(clickedElement:any,userId:string,groupId:string){
    console.log(groupId);
    try {
        const res = await axios.delete(`http://13.235.45.170:4000/removeuser?userId=${userId}&groupId=${groupId}`);
        
        var h5Element = clickedElement.closest("h5");
        if (h5Element) {
            // Remove the <h5> element from its parent
            h5Element.parentNode.removeChild(h5Element);
        }
        alert(res.data.message); 
    } catch (error) {
        console.log(error);
    }
}
async function makeAdmin(userId:string,groupId:string){
    try {
        const res = await axios.get(`http://13.235.45.170:4000/makeAdmin?userId=${userId}&groupId=${groupId}`);
        const adminBtn= document.getElementById('admin'+userId) as HTMLButtonElement;
        adminBtn.innerText='admin';
    } catch (error) {
        console.log(error);
    }
}