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
    localStorage.setItem('groupId', groupId);
    const messageArray = [];
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(function getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(groupId);
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
        console.log('eeeeeeeeeeeeeeeeeeeeeee');
        const element = chatList.firstElementChild.nextSibling;
        if (element)
            element.className = "btn active";
        const activeGroup = document.querySelector('.active');
        if (activeGroup) {
            console.log('eeeeeeeeeeeeeeeeeeeeeee');
            const groupId = activeGroup.id;
            start(groupId);
            localStorage.setItem('groupId', groupId);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
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
function showUserList(userData) {
    const newLi = document.createElement('li');
    newLi.innerHTML = `<input type="checkbox" id="${userData[0]}" name="${userData[1]}" value="${userData[1]}">
    <label for="${userData[0]}" class="form-label"> ${userData[1]}</label><br>`;
    userList.appendChild(newLi);
}
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
function displayGroup(id, groupName) {
    const grpBtn = document.createElement('button');
    grpBtn.className = 'btn';
    grpBtn.id = id;
    grpBtn.innerText = groupName;
    grpBtn.addEventListener('click', () => changeGroup(grpBtn.id, groupName));
    error.style.display = 'none';
    const chatName = document.querySelector('.chat-name');
    chatName.innerHTML = `<i class="bi bi-people-fill"> </i><span>${groupName}</span>`;
    chatList.insertBefore(grpBtn, chatList.firstElementChild.nextSibling);
}
function changeGroup(id, groupName) {
    changeActiveBtn();
    // console.log(id);
    const btn = document.getElementById(id);
    btn.className = 'btn active';
    const chatName = document.querySelector('.chat-name');
    chatName.innerHTML = `<i class="bi bi-people-fill"> </i><span>${groupName}</span>`;
    start(id);
    localStorage.removeItem('messageArray');
}
function changeActiveBtn() {
    const currActiveBtn = document.querySelector('.active');
    if (currActiveBtn)
        currActiveBtn.className = 'btn';
}
