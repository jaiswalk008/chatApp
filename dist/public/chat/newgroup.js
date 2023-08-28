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
const userList = document.querySelector('.user-list');
const userName = localStorage.getItem('username');
const chatList = document.querySelector('.class-list');
const Token = localStorage.getItem('token');
const error = document.querySelector('.alert');
function createGroup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get('http://localhost:4000/getUsers');
            userList.innerHTML = '';
            res.data.userList.filter((element) => {
                if (element.username != userName)
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
            console.log(checkedValues);
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
                    headers: { Authorization: Token }
                });
                console.log(res.data);
                displayGroup(res.data.groupId, res.data.groupName);
                groupNameInput.value = '';
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    //only show the groups in which the user is a part of...
    //getting groups id
    const res = yield axios.get('http://localhost:4000/getGroups', { headers: { Authorization: Token } });
    res.data.groupIds.filter((element, index) => {
        displayGroup(element.groupId, res.data.groupNames[index]);
    });
    const currActiveBtn = document.querySelector('.active');
    if (currActiveBtn)
        currActiveBtn.click();
}));
function displayGroup(id, groupName) {
    const grpBtn = document.createElement('button');
    grpBtn.className = 'btn active';
    grpBtn.id = id;
    grpBtn.innerText = groupName;
    grpBtn.addEventListener('click', () => showGroupChat(grpBtn.id));
    error.style.display = 'none';
    const chatName = document.querySelector('.chat-name');
    chatName.innerHTML = `<i class="bi bi-people-fill"> </i><span>${groupName}</span>`;
    chatList.insertBefore(grpBtn, chatList.firstElementChild.nextSibling);
}
function showGroupChat(id) {
    const currActiveBtn = document.querySelector('.active');
    if (currActiveBtn)
        currActiveBtn.className = 'btn';
}
