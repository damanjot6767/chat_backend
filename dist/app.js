"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = require("./socket/index");
const ws_1 = require("ws");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new ws_1.WebSocketServer({ server: httpServer });
app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`
app.use((0, cors_1.default)({
    origin: "*"
}));
app.use(express_1.default.json({ limit: '20kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20kb' }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
// required for passport
// app.use(passport.initialize());
//-------------------Routes
const routes_1 = require("./routes");
app.use(routes_1.allRouters);
//-----------------Socket
(0, index_1.initializeSocketIO)(io);
//------------------Swagger setup
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
