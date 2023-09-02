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
const signupForm = document.querySelector('.form');
signupForm.addEventListener('submit', signup);
const url1 = 'http://localhost:4000/';
function signup(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const formElement = e.target;
        const userDetails = {
            username: formElement.username.value,
            email: formElement.email.value,
            phone: parseInt(formElement.phone.value),
            password: formElement.password.value
        };
        try {
            const res = yield axios.post(url1 + 'signup', userDetails);
            console.log(res.data.userDetails);
            signupForm.reset();
            window.location.replace('user/login.html');
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
