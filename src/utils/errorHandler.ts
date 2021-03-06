import { Response, NextFunction } from 'express';
import { HTTPClientError, HTTP404Error } from '../utils/httpErrors';
import logger from './logger';

export const notFoundError = () => {
    throw new HTTP404Error("Could not find method");
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
    if (err instanceof HTTPClientError) {
        logger.warn(err);
        res.status(err.statusCode).send(err.message);
    } else {
        next(err);
    }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
    logger.error(err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send("Internal Server Error");
    } else {
        res.status(500).send(err.stack);
    }
};