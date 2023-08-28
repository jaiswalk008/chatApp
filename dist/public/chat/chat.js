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
const groupBtn = document.querySelector('.active');
messageForm.addEventListener('submit', sendMessage);
function sendMessage(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const formElement = e.target;
        const chatMessage = {
            message: formElement.message.value,
            groupId: groupBtn.id
        };
        console.log(chatMessage);
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
function start() {
    let lastMessageId = -1;
    const messageArray = [];
    setInterval(function getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios.get(`http://localhost:4000/getMessages?lastMessageId=${lastMessageId}&groupId=${groupBtn.id}`);
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
window.addEventListener('DOMContentLoaded', () => {
    start();
});
