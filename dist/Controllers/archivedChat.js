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
const message_1 = __importDefault(require("../Models/message"));
const archivedChat_1 = __importDefault(require("../Models/archivedChat"));
const backup = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield message_1.default.findAll();
        // Create archived chat messages in bulk and this is better than inserting one by one
        yield archivedChat_1.default.bulkCreate(data);
        for (const message of data) {
            yield message.destroy();
        }
        console.log('Backup Done', new Date());
    }
    catch (err) {
        console.error('Backup Error:', err);
    }
});
exports.default = backup;
