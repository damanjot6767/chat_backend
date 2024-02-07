import express from "express";
import { createServer } from 'http';
import fs from "fs";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from 'compression';
import { passport } from "./passpost/index"
import logger from 'morgan'
import { initializeSocketIO } from "./socket/index";
import { Server } from "socket.io";
import { chatRouter, messageRouter, userRouter } from "./routes";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(compression());
app.use(logger('dev'));


// required for passport

// app.use(passport.initialize());

//-------------------Routes
app.use("/v1/user", userRouter);
app.use("/v1/chat", chatRouter);
app.use("/v1/message", messageRouter);

//-----------------Socket
initializeSocketIO(io);


//------------------Swagger setup
import YAML from "yaml";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from "./constants";


const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export { httpServer }