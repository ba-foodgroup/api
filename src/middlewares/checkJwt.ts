import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../utils/logger';

interface JWTPayload {
    userId: number,
    username: string
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the JWT token from the head
    const token = <string>req.headers['auth'];
    let jwtPayload: JWTPayload;
    // Attempt validation of token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // Respond with 401 (unauthorized) if token is invalid
        logger.error(`Failed JWT validation: ${error}`)
        res.status(401).send();
        return;
    }
    // The token is valid for an hour, we want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
       expiresIn: "1h"
    });
    res.setHeader("token", newToken);
    // Call the next middleware or controller
    next();
}