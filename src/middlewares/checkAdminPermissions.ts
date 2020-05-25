import { Request, Response, NextFunction } from 'express';
import { getConnection, getRepository } from 'typeorm';

import { User } from '../entities/User';
import { AdminGroup } from '../entities/AdminGroup';
import logger from '../utils/logger';

export const checkAdminPermission = (adminLevel: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Get the user ID from the previous middleware
        const id = res.locals.jwtPayload.userId;
        let check;
        try {
            check = await getRepository(User)
                .createQueryBuilder('user')
                .leftJoin(AdminGroup, 'admin_group', 'user.admin_group_id = admin_group.id')
                .select("permissions")
                .where("user.id = :user_id", { user_id: id })
                .getRawOne();
        } catch (err) {
            res.status(401);
            return;
        }

        if (Number.isInteger(check.permissions) && check.permissions >= adminLevel) {
            next();
        } else {
            return res.status(401);
        }
    };
};