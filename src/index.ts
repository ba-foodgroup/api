import 'reflect-metadata';
import {createConnection} from 'typeorm';
import express from 'express';
import middlewares from './middlewares';
import { applyMiddleware, applyRoutes } from './utils';
import routes from './routes/index';
import errorHandlers from './middlewares/errorHandlers';
import logger from './utils/logger';
import fileUpload from 'express-fileupload';

process.on("uncaughtException", e => {
    logger.error(`uncaughtException: ${e}`);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    if (e)
        logger.error(`unhandledRejection ${e}`);

    process.exit(1);
});

createConnection().then(async connection => {
    // Create express app
    const app = express();

    app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: process.env.TEMPORARY_FILE_DIRECTORY
    }));

    // Apply middlewares
    applyMiddleware(middlewares, app);

    // Apply routes
    applyRoutes(routes, app);

    // Error handling
    applyMiddleware(errorHandlers, app);

    if (process.env.EXPRESS_TRUST_PROXY === 'true') {
        app.set('trust proxy', true);
    }

    // Start express server
    app.listen(3000);

    logger.info("Express server has started on port 3000. (NODE_ENV: " + process.env.NODE_ENV + ")");

}).catch(error => logger.error(`Error: ${error}`));
