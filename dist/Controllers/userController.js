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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const user_1 = __importDefault(require("../Models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = Object.assign({}, req.body);
        const checkEmail = yield user_1.default.findOne({ where: { email: userDetails.email } });
        const checkPhone = yield user_1.default.findOne({ where: { phone: userDetails.phone } });
        console.log(userDetails);
        if (checkEmail) {
            res.status(409).json({ message: "A user is already registered with this e-mail address" });
        }
        else if (checkPhone) {
            res.status(409).json({ message: "A user is already registered with this Phone NumberT" });
        }
        else {
            const saltRounds = 10;
            bcryptjs_1.default.hash(userDetails.password, saltRounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
                //we can use const user because const is blocked scope
                if (err)
                    console.log(err);
                else {
                    const user = yield user_1.default.create(Object.assign(Object.assign({}, userDetails), { password: hash }));
                    res.status(200).json({ message: 'Signup successful', userDetails: user });
                }
            }));
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.addUser = addUser;
