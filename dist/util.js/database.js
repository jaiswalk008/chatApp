"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('chatapp', 'root', 'karan123', { dialect: "mysql", host: process.env.DB_HOST });
exports.default = sequelize;
