"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const index_1 = __importDefault(require("./db/index"));
const app_1 = require("./app");
(0, index_1.default)()
    .then(() => {
    app_1.httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`Server is runing at port ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log("MONGODB connection error", err);
});
