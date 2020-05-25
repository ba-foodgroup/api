import { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkAdminPermission } from '../middlewares/checkAdminPermissions';

export default [
    {
        path: "/user/self",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const user = await UserController.getUser(res.locals.jwtPayload.userId, true);

                if (user !== -1) {
                    res.status(200).json(user);
                } else {
                    // Return internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/:id([0-9]+)",
        method: "get",
        handler: [
            checkJwt,
            checkAdminPermission(3),
            // EXTRA handler her, ikke prioriter denne
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;

                const user = await UserController.getUser(id, true);

                if (user !== -1) {
                    res.status(200).json(user);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/:id([0-9]+)/profile",
        method: "get",
        handler: [
            checkJwt,
            checkAdminPermission(3),
            // EXTRA handler her, ikke prioriter denne
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;

                const user = await UserController.getUser(id, false);

                if (user !== -1) {
                    res.status(200).json(user);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/settings",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const userSettings = await UserController.getUserSettingsById(res.locals.jwtPayload.userId);

                if (userSettings !== -1) {
                    res.status(200).json(userSettings);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/:id([0-9]+)/settings",
        method: "get",
        handler: [
            checkJwt,
            checkAdminPermission(3),
            // EXTRA handler her, ikke prioriter denne
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;

                const userSettings = await UserController.getUserSettingsById(id);

                if (userSettings !== -1) {
                    res.status(200).json(userSettings);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/saved",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const { id = -1 } = res.locals.jwtPayload.userId;

                const userSaved = await UserController.getUserSavedPostsById(id);

                if (userSaved !== -1) {
                    res.status(200).json(userSaved);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/:id([0-9]+)/saved",
        method: "get",
        handler: [
            checkJwt,
            checkAdminPermission(3),
            // Ikke prioritert > trenger extra handler
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;

                const userSaved = await UserController.getUserSavedPostsById(id);

                if (userSaved !== -1) {
                    res.status(200).json(userSaved);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/subforums",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const { id = -1 } = res.locals.jwtPayload.userId;

                const userSubforums = await UserController.getUserSubforumsById(id);

                if (userSubforums !== -1) {
                    res.status(200).json(userSubforums);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/:id([0-9]+)/subforums",
        method: "get",
        handler: [
            checkJwt,
            checkAdminPermission(3),
            // Ikke prioritert, ekstra handler? Eller bare vis offentlige subforum?
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;

                const userSubforums = await UserController.getUserSubforumsById(id);

                if (userSubforums !== -1) {
                    res.status(200).json(userSubforums);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/subforums/feed",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const id = res.locals.jwtPayload.userId;

                const feed = await UserController.getUserSubforumFeedById(id, 0);

                if (feed !== -1) {
                    res.status(200).json(feed);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/subforums/feed/:page([0-9]+)",
        method: "get",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const id = res.locals.jwtPayload.userId;
                const { page = 1 } = req.params;

                const feed = await UserController.getUserSubforumFeedById(id, page);

                if (feed !== -1) {
                    res.status(200).json(feed);
                } else {
                    // Internal server error
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/user/self",
        method: "patch",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                const { visible = -1, showEmail = -1, showBattleTag = -1 } = req.body;
                res.status(200);
            }
        ]
    },
    {
        path: '/user/avatar',
        method: 'put',
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                // No files are uploaded
                if (!req.files || Object.keys(req.files).length == 0) {
                    return res.status(400);
                }

                let avatar = req.files.avatar;
                // Can only have one avatar!
                if (Array.isArray(avatar)) {
                    return res.status(400);
                }

                const result = await UserController.setUserAvatar(res.locals.jwtPayload.userId, avatar);
                if (result === 1) {
                    res.status(200);
                } else {
                    res.status(500);
                }
            }
        ]
    }

];