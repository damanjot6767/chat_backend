const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/*.ts'];

const config = {
    info: {
        title: 'Blog API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:8000',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);