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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = __importDefault(require("./util.js/database"));
//import Routes
const user_1 = __importDefault(require("./Routes/user"));
const chat_1 = __importDefault(require("./Routes/chat"));
const group_1 = __importDefault(require("./Routes/group"));
//importing Models
const user_2 = __importDefault(require("./Models/user"));
const message_1 = __importDefault(require("./Models/message"));
// import Chat from './Models/chat';
const group_2 = __importDefault(require("./Models/group"));
const userGroup_1 = __importDefault(require("./Models/userGroup"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "DELETE"]
}));
server.use(body_parser_1.default.json());
// Message.hasOne(Chat);
// Chat.hasOne(Message)
user_2.default.hasMany(message_1.default);
message_1.default.belongsTo(user_2.default);
group_2.default.belongsToMany(user_2.default, { through: userGroup_1.default });
user_2.default.belongsToMany(group_2.default, { through: userGroup_1.default });
// In the User model
// User.belongsToMany(Group, { through: UserGroup, as: 'groups', foreignKey: 'userId' });
// // In the Group model
// Group.belongsToMany(User, { through: UserGroup, as: 'members', foreignKey: 'groupId' });
server.use(user_1.default);
server.use(chat_1.default);
server.use(group_1.default);
// server.use((req,res) =>{
//     res.sendFile(path.join(__dirname,`public${req.url}`));
// });
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.sync({ force: false });
            server.listen(process.env.PORT || 4000);
        }
        catch (err) {
            console.log(err);
        }
    });
}
startServer();
