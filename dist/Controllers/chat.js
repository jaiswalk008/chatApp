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
exports.getMessages = exports.sendMessage = exports.getUserList = void 0;
const message_1 = __importDefault(require("../Models/message"));
const user_1 = __importDefault(require("../Models/user"));
const sequelize_1 = require("sequelize");
const getUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userList = yield user_1.default.findAll();
        res.status(200).json({ userList: userList });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getUserList = getUserList;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const text = req.body.message;
    console.log(req.body);
    console.log(text);
    try {
        const result = yield req.user.createMessage({ content: text });
        res.status(200).json({ message: text });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lastMessageId = req.query.lastMessageId;
    try {
        const messages = yield message_1.default.findAll({ where: { id: { [sequelize_1.Op.gt]: lastMessageId } },
            include: [
                { model: user_1.default, attributes: ['username'] }
            ],
            limit: 10
        });
        // console.log(messages);
        res.status(200).json({ messages: messages });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getMessages = getMessages;
