"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewRoute = exports.createJsonDoc = void 0;
const fs_1 = __importDefault(require("fs"));
const swagger_info_1 = require("./swagger-info");
const joi_to_swagger_1 = __importDefault(require("joi-to-swagger"));
// Singleton object to hold the state
const swaggerState = {
    currentRoute: [],
    paths: {},
    definitions: {}
};
function createJsonDoc() {
    const swaggerData = swagger_info_1.swaggerInfo;
    fs_1.default.writeFileSync('./swagger.json', JSON.stringify(swaggerData));
}
exports.createJsonDoc = createJsonDoc;
function addNewRoute(joiDefinitions, path, method, auth) {
    if (swaggerState.currentRoute.includes(path + method)) {
        return false;
    }
    swaggerState.currentRoute.push(path + method);
    const swaggerData = fs_1.default.readFileSync('./swagger.json', 'utf-8');
    const otherData = JSON.parse(swaggerData);
    const name = joiDefinitions.model || Date.now().toString();
    const tag = joiDefinitions.group || 'default';
    const summary = joiDefinitions.description || 'No desc';
    const payloadDocumentation = joiDefinitions.payloadDocumentation || 'No documentation';
    const toSwagger = (0, joi_to_swagger_1.default)(joiDefinitions).swagger;
    if (toSwagger && toSwagger.properties && toSwagger.properties.body) {
        swaggerState.definitions = Object.assign(Object.assign({}, swaggerState.definitions), { [name]: toSwagger.properties.body });
    }
    const pathArray = path.split('/').filter(Boolean);
    const transformPath = pathArray.map((pathSegment) => {
        if (pathSegment.charAt(0) === ':') {
            return `/{${pathSegment.substr(1)}}`;
        }
        return `/${pathSegment}`;
    }).join('');
    const parameters = [];
    const { body, params, query, headers, formData, responseDescription } = joiDefinitions;
    if (body) {
        parameters.push({
            "in": "body",
            "name": "body",
            "schema": {
                "$ref": `#/definitions/${name}`
            }
        });
    }
    if (params) {
        const getParams = [];
        const rxp = /{([^}]+)}/g;
        let curMatch;
        while ((curMatch = rxp.exec(transformPath))) {
            getParams.push(curMatch[1]);
        }
        const requiredFields = toSwagger.properties.params.required;
        getParams.forEach((param) => {
            const index = requiredFields ? requiredFields.findIndex((key) => key === param) : -1;
            if (index > -1) {
                toSwagger.properties.params.properties[param].required = true;
            }
            parameters.push(Object.assign({ "name": param, "in": "path" }, toSwagger.properties.params.properties[param]));
        });
    }
    if (query) {
        const keys = Object.keys(toSwagger.properties.query.properties).map((key) => key);
        const requiredFields = toSwagger.properties.query.required;
        keys.forEach((key) => {
            const index = requiredFields ? requiredFields.findIndex((requiredKey) => requiredKey === key) : -1;
            if (index > -1) {
                toSwagger.properties.query.properties[key].required = true;
            }
            parameters.push(Object.assign({ "in": "query", "name": key }, toSwagger.properties.query.properties[key]));
        });
    }
    if (formData) {
        const keys = Object.keys(toSwagger.properties.formData.properties).map((key) => key);
        const requiredFields = toSwagger.properties.formData.required;
        keys.forEach((key) => {
            const index = requiredFields ? requiredFields.findIndex((requiredKey) => requiredKey === key) : -1;
            if (index > -1) {
                toSwagger.properties.formData.properties[key].required = true;
            }
            parameters.push(Object.assign({ "in": "formData", "name": key }, toSwagger.properties.formData.properties[key]));
        });
    }
    if (headers) {
        const keys = Object.keys(toSwagger.properties.headers.properties).map((key) => key);
        const requiredFields = toSwagger.properties.headers.required;
        keys.forEach((key) => {
            const index = requiredFields ? requiredFields.findIndex((requiredKey) => requiredKey === key) : -1;
            if (index > -1) {
                toSwagger.properties.headers.properties[key].required = true;
            }
        });
    }
    if (swaggerState.paths && swaggerState.paths[transformPath]) {
        swaggerState.paths[transformPath] = Object.assign(Object.assign({}, swaggerState.paths[transformPath]), { [method]: {
                "tags": [
                    tag
                ],
                summary,
                description: payloadDocumentation,
                responses: {
                    200: {
                        description: responseDescription || "success"
                    }
                },
                parameters,
            } });
    }
    else {
        swaggerState.paths = Object.assign(Object.assign({}, swaggerState.paths), { [transformPath]: {
                [method]: {
                    "tags": [
                        tag
                    ],
                    summary,
                    description: payloadDocumentation,
                    responses: {
                        200: {
                            description: responseDescription || "success"
                        }
                    },
                    parameters,
                }
            } });
    }
    swaggerState.paths[transformPath][method].security = [];
    if (auth) {
        const securityObject = {};
        securityObject[`authorization`] = [];
        swaggerState.paths[transformPath][method].security.push(securityObject);
    }
    const newData = Object.assign(Object.assign({}, otherData), { definitions: swaggerState.definitions, paths: swaggerState.paths });
    fs_1.default.writeFileSync('swagger.json', JSON.stringify(newData));
    return true;
}
exports.addNewRoute = addNewRoute;
