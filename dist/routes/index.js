"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRouters = void 0;
const user_route_1 = __importDefault(require("./user-route"));
const chat_route_1 = __importDefault(require("./chat-route"));
const message_route_1 = __importDefault(require("./message-route"));
const swagger_util_1 = require("../utils/swagger-util");
const express_1 = require("express");
const routes = [
    ...user_route_1.default,
    ...chat_route_1.default,
    ...message_route_1.default
];
//-----------------------swagger setup
if (process.env.NODE_ENV === "development") {
    (0, swagger_util_1.createJsonDoc)();
    routes.forEach(route => {
        (0, swagger_util_1.addNewRoute)(route.joiSchemaForSwagger, route.path, route.method.toLowerCase(), route.auth);
    });
}
const allRouters = (0, express_1.Router)();
exports.allRouters = allRouters;
routes.forEach(route => {
    if (route.middlewares.length > 0) {
        allRouters[route.method](route.path, ...route.middlewares, route.handler);
    }
    else {
        allRouters[route.method](route.path, route.handler);
    }
});
