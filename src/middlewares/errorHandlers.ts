import { Request, Response, NextFunction, Router } from 'express';
import * as errorHandler from '../utils/errorHandler';

const handle404Error = (router: Router) => {
    router.use((req: Request, res: Response) => {
        errorHandler.notFoundError();
    });
};

const handleClientError = (router: Router) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.clientError(err, res, next);
    });
};

const handleServerError = (router: Router) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.serverError(err, res, next);
    })
};

export default [handle404Error, handleClientError, handleServerError];