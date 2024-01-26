import express from "express";
import { createServer } from 'http';
import fs from "fs";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from 'compression';
import logger from 'morgan'
import { initializeSocketIO } from "./socket/index";
import { Server } from "socket.io";
import { userRouter } from "./routes";
import { cookieOptions } from "./constants";

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
app.use(express.static("public"));
app.use(cookieParser());
app.use(compression());
app.use(logger('dev'));


//-------------------Routes
app.use("/v1/user", userRouter);

initializeSocketIO(io);

export { app }