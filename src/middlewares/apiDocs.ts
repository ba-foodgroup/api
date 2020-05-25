import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '../config/swagger.json';
import logger from '../utils/logger';

// Change host if not in production
if (process.env.NODE_ENV !== 'PRODUCTION') {
    swaggerConfig.host="localhost:3000";
    swaggerConfig.basePath="";
}

logger.info(`Swagger is running at: ${swaggerConfig.host}${swaggerConfig.basePath}/docs`);

export const handleAPIDocumentation = (router: Router) =>
    router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));