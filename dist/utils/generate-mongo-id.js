"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMongooseID = void 0;
const mongodb_1 = require("mongodb");
// Generate a unique MongoDB-like ID
const generateMongooseID = () => {
    return new mongodb_1.ObjectId().toHexString();
};
exports.generateMongooseID = generateMongooseID;
