import { Router } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

export const handleCors = (router: Router) => {
    router.use(cors({ credentials: true, origin: true}));
}

export const handleHelmet = (router: Router) => {
    router.use(helmet());
}

export const handleBodyReqParsing = (router: Router) => {
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
}

export const handleCompression = (router: Router) => {
    router.use(compression());
}