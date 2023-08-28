declare var axios:any;
const userList = document.querySelector('.user-list') as HTMLUListElement;
const userName = localStorage.getItem('username');
const chatList= document.querySelector('.class-list') as HTMLDivElement;
const Token = localStorage.getItem('token');
const error = document.querySelector('.alert') as HTMLParagraphElement;
async function createGroup(){
    try {
        const res = await axios.get('http://localhost:4000/getUsers');
        userList.innerHTML='';
        res.data.userList.filter((element:any)=> {
            if(element.username!=userName) showUserList([element.id, element.username])
        })
    } catch (error) {
        console.log(error);
    }
}
function showUserList(userData:[number,string]){
    
    const newLi = document.createElement('li');
    newLi.innerHTML=`<input type="checkbox" id="${userData[0]}" name="${userData[1]}" value="${userData[1]}">
    <label for="${userData[0]}" class="form-label"> ${userData[1]}</label><br>`
    userList.appendChild(newLi);
}
async function addNewGroup(e:Event){
    
    const groupNameInput  = document.getElementById('groupname') as HTMLInputElement;
    const groupName = groupNameInput.value;
    if(!groupName.length){
        
        error.style.display = 'block';
    }
    else{
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const checkedValues = Array.from(checkboxes).map((checkbox:any) => parseInt(checkbox.id));
        console.log(checkedValues);
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
            headers:{Authorization:Token}
            });
            console.log(res.data);
            displayGroup(res.data.groupId, res.data.groupName);
            groupNameInput.value='';
        }
        catch(err){console.log(err);}
    }
    
}
window.addEventListener('DOMContentLoaded',async () =>{
    //only show the groups in which the user is a part of...
    //getting groups id
    const res = await axios.get('http://localhost:4000/getGroups',{headers:{Authorization:Token}});
    
    
    res.data.groupIds.filter((element:any,index:number)=>{
        displayGroup(element.groupId,res.data.groupNames[index]);
    })
    const currActiveBtn  = document.querySelector('.active') as HTMLButtonElement;
    if(currActiveBtn) currActiveBtn.click();

})
function displayGroup(id:string, groupName:string){
    const grpBtn = document.createElement('button');
    
    grpBtn.className='btn active';
    grpBtn.id= id;
    grpBtn.innerText=groupName;
    grpBtn.addEventListener('click',() => showGroupChat(grpBtn.id));
    error.style.display = 'none';

    const chatName = document.querySelector('.chat-name') as HTMLDivElement;
    chatName.innerHTML =`<i class="bi bi-people-fill"> </i><span>${groupName}</span>`;
    
    chatList.insertBefore(grpBtn,chatList.firstElementChild.nextSibling);
}
function showGroupChat(id:string){
    const currActiveBtn  = document.querySelector('.active') as HTMLButtonElement;
    if(currActiveBtn) currActiveBtn.className='btn';
} 