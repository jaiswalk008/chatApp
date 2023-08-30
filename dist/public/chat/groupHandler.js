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
const chatHead = document.querySelector('.chat-name');
chatHead.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const groupInfo = document.querySelector('.group-info');
    const username = localStorage.getItem('username');
    groupInfo.style.display = 'block';
    const groupSpan = chatHead.firstElementChild.nextElementSibling;
    const groupId = groupSpan.id;
    const groupName = groupSpan.innerHTML;
    const memberListContainer = document.querySelector('.member-list');
    console.log(groupName);
    const getMembers = yield axios.get('http://localhost:4000/getMembers?groupId=' + groupId);
    const groupNameDisplay = document.querySelector('.groupname');
    groupNameDisplay.innerText = groupName;
    console.log(getMembers.data.userIds);
    getMembers.data.userIds.filter((userInfo, index) => {
        let text = '';
        const memberInfo = document.createElement('h5');
        text = userInfo.admin ? "admin" : "Make admin";
        memberInfo.innerHTML =
            `<h5>${getMembers.data.userNames[index]} <i onClick="removeUser(${userInfo.userId})" class="bi bi-x fs-3 text-danger"></i> <button class="btn btn-danger" onClick="">${text}</button></h5>`;
        memberListContainer.appendChild(memberInfo);
    });
}));
function removeUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id);
    });
}
