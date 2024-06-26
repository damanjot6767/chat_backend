import fs from 'fs';
import { swaggerInfo } from './swagger-info';
import j2s from 'joi-to-swagger';

// Singleton object to hold the state
const swaggerState = {
    currentRoute: [] as string[],
    paths: {} as Record<string, any>,
    definitions: {} as Record<string, any>
};

interface JoiDefinitions {
    model?: string;
    group?: string;
    description?: string;
    payloadDocumentation?: string;
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    formData?: any;
    responseDescription?: string;
}

function createJsonDoc(): void {
    const swaggerData = swaggerInfo;
    fs.writeFileSync('./swagger.json', JSON.stringify(swaggerData));
}

function addNewRoute(joiDefinitions: any, path: string, method: string, auth: boolean): boolean {
    if (swaggerState.currentRoute.includes(path + method)) {
        return false;
    }

    swaggerState.currentRoute.push(path + method);

    const swaggerData = fs.readFileSync('./swagger.json', 'utf-8');
    const otherData = JSON.parse(swaggerData);
    const name = joiDefinitions.model || Date.now().toString();
    const tag = joiDefinitions.group || 'default';
    const summary = joiDefinitions.description || 'No desc';
    const payloadDocumentation = joiDefinitions.payloadDocumentation || 'No documentation';

    const toSwagger = j2s(joiDefinitions).swagger;
    if (toSwagger && toSwagger.properties && toSwagger.properties.body) {
        swaggerState.definitions = {
            ...swaggerState.definitions,
            [name]: toSwagger.properties.body
        };
    }

    const pathArray = path.split('/').filter(Boolean);
    const transformPath = pathArray.map((pathSegment) => {
        if (pathSegment.charAt(0) === ':') {
            return `/{${pathSegment.substr(1)}}`;
        }
        return `/${pathSegment}`;
    }).join('');

    const parameters: any[] = [];

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
        const getParams: string[] = [];
        const rxp = /{([^}]+)}/g;
        let curMatch;

        while ((curMatch = rxp.exec(transformPath))) {
            getParams.push(curMatch[1]);
        }
        const requiredFields = toSwagger.properties.params.required;
        getParams.forEach((param) => {
            const index = requiredFields ? requiredFields.findIndex((key: string) => key === param) : -1;
            if (index > -1) {
                toSwagger.properties.params.properties[param].required = true;
            }
            parameters.push({
                "name": param,
                "in": "path",
                ...toSwagger.properties.params.properties[param]
            });
        });
    }

    if (query) {
        const keys = Object.keys(toSwagger.properties.query.properties).map((key) => key);
        const requiredFields = toSwagger.properties.query.required;
        keys.forEach((key) => {
            const index = requiredFields ? requiredFields.findIndex((requiredKey: string) => requiredKey === key) : -1;
            if (index > -1) {
                toSwagger.properties.query.properties[key].required = true;
            }
            parameters.push({
                "in": "query",
                "name": key,
                ...toSwagger.properties.query.properties[key]
            });
        });
    }

    if (formData) {
        const keys = Object.keys(toSwagger.properties.formData.properties).map((key) => key);
        const requiredFields = toSwagger.properties.formData.required;
        keys.forEach((key) => {
            const index = requiredFields ? requiredFields.findIndex((requiredKey: string) => requiredKey === key) : -1;
            if (index > -1) {
                toSwagger.properties.formData.properties[key].required = true;
            }
            parameters.push({
                "in": "formData",
                "name": key,
                ...toSwagger.properties.formData.properties[key]
            });
        });
    }

    if (headers) {
        const keys = Object.keys(toSwagger.properties.headers.properties).map((key) => key);
        const requiredFields = toSwagger.properties.headers.required;
        keys.forEach((key) => {
            const index = requiredFields ? requiredFields.findIndex((requiredKey: string) => requiredKey === key) : -1;
            if (index > -1) {
                toSwagger.properties.headers.properties[key].required = true;
            }
        });
    }

    if (swaggerState.paths && swaggerState.paths[transformPath]) {
        swaggerState.paths[transformPath] = {
            ...swaggerState.paths[transformPath],
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
        };
    } else {
        swaggerState.paths = {
            ...swaggerState.paths,
            [transformPath]: {
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
            }
        };
    }

    swaggerState.paths[transformPath][method].security = [];
    if (auth) {
        const securityObject: Record<string, string[]> = {};
        securityObject[`authorization`] = [];
        swaggerState.paths[transformPath][method].security.push(securityObject);
    }

    const newData = {
        ...otherData,
        definitions: swaggerState.definitions,
        paths: swaggerState.paths
    };

    fs.writeFileSync('swagger.json', JSON.stringify(newData));
    return true;
}

export { createJsonDoc, addNewRoute };
