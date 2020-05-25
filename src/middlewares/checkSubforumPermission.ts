import { Request, Response, NextFunction } from 'express';
import { getConnection, getRepository } from 'typeorm';
import logger from '../utils/logger';

import { Subforum } from '../entities/Subforum';
import { SubforumMember } from '../entities/SubforumMember';
import { SubforumMemberGroup } from '../entities/SubforumMemberGroup';

export interface SubforumPermissionCheck {
    checkMembership?: boolean, // default value = true
    minRank?: number, // default value -1
    maxRank?: number, // default value -1,
    checkBody?: boolean //default value false
}

/**
 * closure for subforum permission check
 * @param check What to check for, see interface
 */
export const checkSubforumPermission = (checks: SubforumPermissionCheck) => {

    /**
     * Verifies that a member actually has permissions for the specified subforum,
     * assuming that the subforum requires membership!
     * Note: This currently uses two queries, this could probably be reduced to one by using typeorm getRaw.
     * @param req The express request object
     * @param res The express response object
     * @param next The next function to call
     */
    return async (req: Request, res: Response, next: NextFunction) => {
        // Get the user ID fro mthe previous middleware
        const id = res.locals.jwtPayload.userId;
        const { checkMembership = true, minRank = -1, maxRank = -1 , checkBody = false } = checks;

        console.info(`checkSubforumPermission(${checks}, id: ${id})`);

        // Get subforum ID from the URL
        const subforumId: number
            = !checkBody ? Number.parseInt(req.params.id) : Number.parseInt(req.body.subforum_id);

        let check;
        try {
            check = await getRepository(Subforum)
                .createQueryBuilder('subforum')
                .leftJoin(SubforumMember, 'subforum_member', "subforum_member.subforum_id = subforum.id")
                .leftJoin(SubforumMemberGroup, 'subforum_member_group', "subforum_member_group.id = subforum_member.subforum_group_id")
                .select([
                    "subforum.restricted",
                    "subforum_member.restrictions",
                    "subforum_member.admin_restricted",
                    "subforum_member_group.permissions"
                ])
                .where(
                    "subforum.id = :subforum_id AND subforum_member.user_id = :user_id",
                    { subforum_id: subforumId, user_id: id }
                )
                .getRawOne();
        } catch (err) {
            console.error(err);
            res.status(401).send();
            check = -1;
        }
        if (check) {
            if (check.subforum_restricted) {
                const isMember = check.subforum_member_restrictions !== undefined;
                // User is not a member
                if (!isMember && checkMembership) {
                    res.status(401).send();
                    return;
                }

                const subforumPerm = check.subforum_member_group.permissions;

                // Minimum rank is higher than user's
                if (minRank !== -1 && minRank > subforumPerm) {
                    res.status(401).send();
                    return;
                }

                // Maximum rank is lower than user's
                if (maxRank !== -1 && maxRank < subforumPerm) {
                    res.status(401).send();
                    return;
                }

                // User has been restricted from the subforum, either by an admin or a subforum moderator+
                if (check.subforum_member_restrictions === true || check.subforum_member_admin_restricted === true) {
                    res.status(401).send();
                    return;
                }
            }
        }
        next();
    };
}