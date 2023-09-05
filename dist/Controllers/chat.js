"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.sendFile = exports.getMessages = exports.sendMessage = exports.getUserList = void 0;
const message_1 = __importDefault(require("../Models/message"));
const user_1 = __importDefault(require("../Models/user"));
// import { Model, Op } from 'sequelize';
const S3services = __importStar(require("../services/s3service"));
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
    try {
        const result = yield req.user.createMessage({ content: text, groupId: req.body.groupId });
        res.status(200).json({ message: text });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.query.groupId;
    try {
        const messages = yield message_1.default.findAll({ where: { groupId: groupId },
            include: [
                { model: user_1.default, attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        // console.log(messages); 
        res.status(200).json({ messages: messages });
    }
    catch (err) {
        console.log(err);
    }
});
exports.getMessages = getMessages;
const sendFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.query.groupId;
        const file = req.files[0];
        // console.log(file);
        const fileURL = yield S3services.uploadToS3(file, file.originalname);
        const chat = yield req.user.createMessage({ content: fileURL, groupId: groupId, type: file.mimetype });
        res.status(200).json({ message: chat, status: true });
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendFile = sendFile;
