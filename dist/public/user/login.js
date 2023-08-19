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
const loginForm = document.querySelector('.form');
loginForm.addEventListener('submit', login);
const url2 = 'http://localhost:4000/';
function login(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const formElement = e.target;
        const loginDetails = {
            email: formElement.email.value,
            password: formElement.password.value
        };
        console.log(loginDetails);
        try {
            const res = yield axios.post(url2 + 'login', loginDetails);
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            loginForm.reset();
            alert('logged in successfully');
        }
        catch (err) {
            console.log(err);
            const message = err.response.data.message;
            const messageHeader = document.querySelector('.message');
            messageHeader.innerText = message;
            messageHeader.style.display = 'block';
        }
    });
}
