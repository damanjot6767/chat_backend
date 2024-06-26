import userRouter from './user-route'
import chatRouter from './chat-route'
import messageRouter from './message-route'
import { addNewRoute, createJsonDoc } from '../utils/swagger-util';
import { Router } from 'express';

const routes = [
    ...userRouter,
    ...chatRouter,
    ...messageRouter
]
//-----------------------swagger setup
if (process.env.NODE_ENV ==="development") {
    
    createJsonDoc();

    routes.forEach(route => {
        addNewRoute(route.joiSchemaForSwagger, route.path, route.method.toLowerCase(), route.auth);
    });
}

const allRouters = Router();

routes.forEach(route => {
    if (route.middlewares.length > 0) {
        allRouters[route.method](route.path, ...route.middlewares, route.handler);
    } else {
        allRouters[route.method](route.path, route.handler);
    }
});

export {allRouters};