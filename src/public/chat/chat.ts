declare const io:any;
declare var axios:any;
const socket: any = io('http://localhost:4000/');
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
const fileInput = document.getElementById('fileInput') as HTMLInputElement;

socket.on('connect',()=>{
    console.log(socket.id);
})
socket.on('received-message',(messageData:{message:string,groupId:string,username:string,type:string}) =>{
    // console.log(messageData);
    showMessage(messageData);
  })
//function for sending message
async function sendMessage(e:Event){
    e.preventDefault();
    const groupBtn= document.querySelector('.active') as HTMLButtonElement;
    
    const formElement = e.target as HTMLFormElement;
    const message = formElement.message.value;
    if(message=="") return;
    const chatMessage = {
        message:formElement.message.value,
        groupId: groupBtn.id,
        username:username,
        type:"text"
    };
    // console.log(chatMessage);
    try {
        const res = await axios.post('http://localhost:4000/sendMessage',chatMessage,{
            headers:{Authorization:token}
        });
        socket.emit('send-message',chatMessage);
        showMessage(chatMessage);
        
        messageForm.reset();
    } catch (error) {
        console.log(error);
    }

}
function sendFile() {
    console.log('clicked send buttm');
    fileInput.click();
  }
  // const imageFileTypes = ['jpeg','jpg','png','gif'];
    // const videoFileTypes = ['mp4','mkv'];
  // Add an event listener to the file input element to handle file selection
fileInput.addEventListener('change',async function () {
    console.log('input');
    const selectedFiles = this.files;
    const currActiveBtn=document.querySelector('.active') as HTMLButtonElement;
    // Loop through all selected files
    for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(file)
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(`http://localhost:4000/sendFile?groupId=${currActiveBtn.id}`, formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('in ')
            console.log(response.data.message);
            const messageData= {
                message:response.data.message.content,
                groupId:currActiveBtn.id,
                username:username,
                type:response.data.message.type
            }
            console.log(messageData);
            socket.emit('send-message', messageData);
            showMessage(messageData)
            // console.log('Upload successful!');
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
  });

//function for showing message on chat
function showMessage(messageData:{message:string,username:string,type:string}){
    console.log(messageData);
    const newDiv = document.createElement('div');
    let classname="message";
    if(messageData.username==username) {
        classname = "my-message";
        messageData.username="you";
    }
    const fileType = messageData.type.split('/').shift();
    if(fileType=='image'){
        newDiv.innerHTML=`<p class="${classname}">${messageData.username}:<br> <img src="${messageData.message}" width="300" height="240"></p>`;
    }
    else if(fileType=="video"){
        newDiv.innerHTML=`<p class="${classname}">${messageData.username}: <video width="320" height="240" controls> <source src="${messageData.message}" type="video/mp4"></video></p>`;
    }
    else if(fileType=="text"){
        newDiv.innerHTML=`<p class="${classname}">${messageData.username}: ${messageData.message}</p>`;
    }
    else{
        newDiv.innerHTML=`<p class="${classname}">${messageData.username}: <a href="${messageData.message}">FILE</a></p>`;
    }
    chatContainer.appendChild(newDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight
}

//function for getting chat messages
async function getMessages(groupId:string){
    // console.log(groupId);

    try {
        const res = await axios.get(`http://localhost:4000/getMessages?groupId=${groupId}`);
        // console.log(res.data.messages);
            
        res.data.messages.reverse().filter((element: any) => {
            showMessage({message:element.content,username:element.user.username,type:element.type});
        });      

        } catch (error) {
            console.log(error);
        }
   
}

window.addEventListener('DOMContentLoaded',async () =>{
    try{
        const res = await axios.get('http://localhost:4000/getGroups',{headers:{Authorization:token}});

        res.data.groupIds.filter((element:any,index:number)=>{
            displayGroup(element.groupId,res.data.groupNames[index]);
        })
       
        const element = chatList.firstElementChild.nextSibling as HTMLButtonElement;
        // changeActiveBtn(element.id);
        if(element) {
            element.className="btn active";
            socket.emit('join-room',element.id);
            console.log('joined room:'+element.id);
        }
        
        getMessages(element.id);
    }
    catch(err) {console.log(err);}
    
}) 
//function for creating groups
async function createGroup(){
    try {
        const res = await axios.get('http://localhost:4000/getUsers');
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
            const res =await axios.post('http://localhost:4000/createGroup',data,{
            headers:{Authorization:token}
            });
            // console.log(res.data);
            const currActiveBtn  = document.querySelector('.active') as HTMLButtonElement;
            if(currActiveBtn) {
                // console.log(currActiveBtn.id);
                socket.emit('leave-room', currActiveBtn.id);
                console.log('left-room:' +currActiveBtn.id);
                console.log(currActiveBtn.id);
                currActiveBtn.className='btn';
            }
            displayGroup(res.data.groupId, res.data.groupName);
            const element = chatList.firstElementChild.nextSibling as HTMLButtonElement;
            element.className="btn active";
            groupNameInput.value='';
            getMessages(res.data.groupId);
            socket.emit('join-room',res.data.groupId);
            console.log('joined room:'+res.data.groupId);
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
    chatContainer.innerHTML='';
    // socket.emit('join-room',grpBtn.id);
    // socket.emit('leave-room', grpBtn.id);
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
    getMessages(id);
    chatContainer.innerHTML='';
    socket.emit('join-room',id);
} 

function changeActiveBtn(groupId:string){
    const currActiveBtn  = document.querySelector('.active') as HTMLButtonElement;
    if(currActiveBtn) {
        socket.emit('leave-room', currActiveBtn.id);
        // console.log(currActiveBtn.id);
        currActiveBtn.className='btn';
    }
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
    const getMembers = await axios.get('http://localhost:4000/getMembers?groupId='+groupId);
    const groupNameDisplay = document.querySelector('.groupname') as HTMLParagraphElement;
    groupNameDisplay.innerText=groupName;
    // console.log(getMembers.data.userIds);
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
    // console.log(groupId);
    try {
        const res = await axios.delete(`http://localhost:4000/removeuser?userId=${userId}&groupId=${groupId}`);
        
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
        const res = await axios.get(`http://localhost:4000/makeAdmin?userId=${userId}&groupId=${groupId}`);
        const adminBtn= document.getElementById('admin'+userId) as HTMLButtonElement;
        adminBtn.innerText='admin';
    } catch (error) {
        console.log(error);
    }
}