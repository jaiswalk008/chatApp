"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../util.js/database"));
const UserGroup = database_1.default.define('user_group', {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
    },
});
exports.default = UserGroup;
