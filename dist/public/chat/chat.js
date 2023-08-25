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
function showUsersList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get('http://localhost:4000/getUsers');
            console.log(res.data.userList);
        }
        catch (error) {
            console.log(error);
        }
    });
}
messageForm.addEventListener('submit', sendMessage);
function sendMessage(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const formElement = e.target;
        const chatMessage = {
            message: formElement.message.value
        };
        console.log(chatMessage);
        try {
            const res = yield axios.post('http://localhost:4000/sendMessage', chatMessage, {
                headers: { Authorization: token }
            });
            showMessage([res.data.message, username]);
            messageForm.reset();
        }
        catch (error) {
            console.log(error);
        }
    });
}
function showMessage(data) {
    const newDiv = document.createElement('div');
    let classname = "message";
    if (data[1] == username) {
        classname = "my-message";
        data[1] = "you";
    }
    newDiv.innerHTML = `<p class="${classname}">${data[1]}: ${data[0]}</p>`;
    chatContainer.appendChild(newDiv);
}
function start() {
    setInterval(function getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios.get('http://localhost:4000/getMessages');
                // console.log(res.data.messages);
                chatContainer.innerHTML = '';
                res.data.messages.filter((element) => {
                    showMessage([element.content, element.user.username]);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }, 1000);
}
window.addEventListener('DOMContentLoaded', () => {
    start();
});
