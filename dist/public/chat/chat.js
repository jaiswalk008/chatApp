"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const chatContainer = document.querySelector('.chat');
const messageForm = document.querySelector('.send-message');
const userList = document.querySelector('.user-list');
const chatList = document.querySelector('.class-list');
const error = document.querySelector('.alert');
const groupInfo = document.querySelector('.group-info');
// const groupBtn= document.querySelector('.active') as HTMLButtonElement;
messageForm.addEventListener('submit', sendMessage);
//function for sending message
function sendMessage(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const groupBtn = document.querySelector('.active');
        const formElement = e.target;
        const chatMessage = {
            message: formElement.message.value,
            groupId: groupBtn.id
        };
        // console.log(chatMessage);
        try {
            const res = yield axios.post('http://localhost:4000/sendMessage', chatMessage, {
                headers: { Authorization: token }
            });
            // showMessage([res.data.message , username]);
            messageForm.reset();
        }
        catch (error) {
            console.log(error);
        }
    });
}
//function for showing message on chat
function showMessage() {
    chatContainer.innerHTML = '';
    const storedMessageArray = localStorage.getItem('messageArray');
    if (storedMessageArray) {
        const parsedMessageArray = JSON.parse(storedMessageArray);
        parsedMessageArray.filter(element => {
            const newDiv = document.createElement('div');
            let classname = "message";
            if (element[2] == username) {
                classname = "my-message";
                element[2] = "you";
            }
            newDiv.innerHTML = `<p class="${classname}">${element[2]}: ${element[1]}</p>`;
            chatContainer.appendChild(newDiv);
        });
    }
}
let intervalId = null;
//function for getting chat messages
function start(groupId) {
    // console.log(groupId);
    let lastMessageId = -1;
    const messageArray = [];
    //clearing interval id so that the function is not getting called with older ids
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(function getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(groupId);
                const res = yield axios.get(`http://localhost:4000/getMessages?lastMessageId=${lastMessageId}&groupId=${groupId}`);
                // console.log(res.data.messages);
                // lastMessageId = res.data.messages.At(-1).id;
                res.data.messages.filter((element) => {
                    // showMessage([element.content, element.user.username]);
                    lastMessageId = element.id;
                    messageArray.push([element.id, element.content, element.user.username]);
                });
                while (messageArray.length > 10)
                    messageArray.shift();
                localStorage.setItem('messageArray', JSON.stringify(messageArray));
                showMessage();
            }
            catch (error) {
                console.log(error);
            }
        });
    }, 1000);
}
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios.get('http://localhost:4000/getGroups', { headers: { Authorization: token } });
        res.data.groupIds.filter((element, index) => {
            displayGroup(element.groupId, res.data.groupNames[index]);
        });
        const element = chatList.firstElementChild.nextSibling;
        changeActiveBtn(element.id);
        if (element)
            element.className = "btn active";
        start(element.id);
    }
    catch (err) {
        console.log(err);
    }
}));
//function for creating groups
function createGroup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get('http://localhost:4000/getUsers');
            userList.innerHTML = '';
            res.data.userList.filter((element) => {
                if (element.username != username)
                    showUserList([element.id, element.username]);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
//function for showing user list when creating a group
function showUserList(userData) {
    const newLi = document.createElement('li');
    newLi.innerHTML = `<input type="checkbox" id="${userData[0]}" name="${userData[1]}" value="${userData[1]}">
    <label for="${userData[0]}" class="form-label"> ${userData[1]}</label><br>`;
    userList.appendChild(newLi);
}
//function for creating the group
function addNewGroup(e) {
    return __awaiter(this, void 0, void 0, function* () {
        const groupNameInput = document.getElementById('groupname');
        const groupName = groupNameInput.value;
        if (!groupName.length) {
            error.style.display = 'block';
        }
        else {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            const checkedValues = Array.from(checkboxes).map((checkbox) => parseInt(checkbox.id));
            // console.log(checkedValues);
            const closeBtn = document.getElementById('close');
            closeBtn.click();
            const data = {
                groupName: groupName,
                userIds: checkedValues
            };
            // got the ids now and also do incliude the users id as well
            // send the userId along with the geoup name to backend
            try {
                const res = yield axios.post('http://localhost:4000/createGroup', data, {
                    headers: { Authorization: token }
                });
                // console.log(res.data);
                const currActiveBtn = document.querySelector('.active');
                if (currActiveBtn)
                    currActiveBtn.className = 'btn';
                displayGroup(res.data.groupId, res.data.groupName);
                const element = chatList.firstElementChild.nextSibling;
                element.className = "btn active";
                groupNameInput.value = '';
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
//function for displaying groupname in the chat list
//Note: The groups which the user is a part of will be visible to the user
function displayGroup(id, groupName) {
    const grpBtn = document.createElement('button');
    grpBtn.className = 'btn';
    grpBtn.id = id;
    grpBtn.innerText = groupName;
    grpBtn.addEventListener('click', () => changeGroup(grpBtn.id, groupName));
    error.style.display = 'none';
    const chatName = document.querySelector('.chat-name');
    chatName.innerHTML = `<i class="bi bi-people-fill"> </i><span id="${grpBtn.id}">${groupName}</span>`;
    chatList.insertBefore(grpBtn, chatList.firstElementChild.nextSibling);
}
//function for switching chats
function changeGroup(id, groupName) {
    changeActiveBtn(id);
    groupInfo.style.display = 'none';
    // console.log(id);
    const btn = document.getElementById(id);
    btn.className = 'btn active';
    const chatName = document.querySelector('.chat-name');
    chatName.innerHTML = `<i class="bi bi-people-fill"> </i><span id="${id}">${groupName}</span>`;
    start(id);
    localStorage.removeItem('messageArray');
}
function changeActiveBtn(groupId) {
    const currActiveBtn = document.querySelector('.active');
    if (currActiveBtn)
        currActiveBtn.className = 'btn';
    localStorage.setItem('groupId', groupId);
}
const chatHead = document.querySelector('.chat-name');
chatHead.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    groupInfo.style.display = 'block';
    const groupSpan = chatHead.firstElementChild.nextElementSibling;
    const groupId = groupSpan.id;
    const groupName = groupSpan.innerHTML;
    const memberListContainer = document.querySelector('.member-list');
    memberListContainer.innerHTML = '';
    // console.log(groupName);
    const getMembers = yield axios.get('http://localhost:4000/getMembers?groupId=' + groupId);
    const groupNameDisplay = document.querySelector('.groupname');
    groupNameDisplay.innerText = groupName;
    console.log(getMembers.data.userIds);
    let ind = getMembers.data.userNames.indexOf(username);
    let flag = false;
    if (getMembers.data.userIds[ind].admin)
        flag = true;
    getMembers.data.userIds.filter((userInfo, index) => {
        let text = '';
        const memberInfo = document.createElement('h5');
        text = userInfo.admin ? "admin" : "Make admin";
        let display = '';
        if (index == ind)
            display = 'd-none';
        if (flag) {
            memberInfo.innerHTML =
                `${getMembers.data.userNames[index]} <i onClick="removeUser(this,${userInfo.userId},${groupId})" class="bi bi-x fs-3 text-danger ${display}"></i> <button class="btn btn-danger" id="admin${userInfo.userId}" onClick="makeAdmin(${userInfo.userId},${groupId})">${text}</button>`;
        }
        else {
            if (text == "admin")
                memberInfo.innerHTML =
                    `${getMembers.data.userNames[index]} <button class="btn btn-danger" >${text}</button>`;
            else {
                memberInfo.innerHTML = `${getMembers.data.userNames[index]}`;
            }
        }
        memberListContainer.appendChild(memberInfo);
    });
}));
function removeUser(clickedElement, userId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(groupId);
        try {
            const res = yield axios.delete(`http://localhost:4000/removeuser?userId=${userId}&groupId=${groupId}`);
            var h5Element = clickedElement.closest("h5");
            if (h5Element) {
                // Remove the <h5> element from its parent
                h5Element.parentNode.removeChild(h5Element);
            }
            alert(res.data.message);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function makeAdmin(userId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get(`http://localhost:4000/makeAdmin?userId=${userId}&groupId=${groupId}`);
            const adminBtn = document.getElementById('admin' + userId);
            adminBtn.innerText = 'admin';
        }
        catch (error) {
            console.log(error);
        }
    });
}
