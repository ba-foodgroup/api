import { Request, Response, response } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkSubforumPermission } from '../middlewares/checkSubforumPermission';
import SubforumController from '../controllers/SubforumController';
import logger from '../utils/logger';
import UserController from '../controllers/UserController';

export default [
    {
        path: "/post/:id([0-9]+)/overview",
        method: "get",
        handler: [
            checkJwt,
            //checkSubforumPermission({ checkBody: true }),
            async (req: Request, res: Response) => {
                const result = await SubforumController.getSubforumPostOverview(req.params.id);

                if (result !== -1) {
                    res.json(result).status(200);
                } else {
                    res.status(500).send();
                }
            }
        ]
    },
    {
        path: "/post/general",
        method: "post",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkBody: true }),
            async (req: Request, res: Response) => {
                const id = res.locals.jwtPayload.userId;

                const result = await SubforumController.postToSubforumGeneral(id, req.body);

                if (result !== -1) {
                    res.json({ postId: result }).status(200);
                } else {
                    res.status(500).send();
                }
            }
        ]
    },
    {
        path: "/post/recipe",
        method: "post",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkBody: true }),
            async (req: Request, res: Response) => {
                const id = res.locals.jwtPayload.userId;
                const result = await SubforumController.postToSubforumRecipe(id, req.body);

                if (result > 0) {
                    res.json({ recipeId: result}).status(200);
                } else {
                    if (result == 0) {
                        res.status(401).send();
                    } else {
                        res.status(500).send();
                    }
                }
            }
        ]
    },
    {
        path: "/post/icon",
        method: "post",
        handler: [
            // er post riktig her? finn ut
            checkJwt,
            checkSubforumPermission({ checkBody: true }),
            // TODO: CHECK POST PERMISSION
            async (req: Request, res: Response) => {
                // No files are uploaded
                if (!req.files || Object.keys(req.files).length == 0) {
                    return res.status(400).send();
                }

                let icon = req.files.icon;
                // Can only have one avatar!
                if (Array.isArray(icon)) {
                    return res.status(400).send();
                }

                const postId = req.body.subforumPostListId;

                const result = await SubforumController.setPostImage(postId, icon);

                res.status(501).send(result);
            }
        ]
    },
    {
        path: "/post/:id([0-9]+)/save",
        method: "post",
        handler: [
            checkJwt,
            //checkSubforumPermission({ checkBody: true }),
            // TODO: check permission fra post ID middleware?
            async (req: Request, res: Response) => {
                const id = res.locals.jwtPayload.userId;
                const postId = req.params.id;
                console.log(`userId: ${id}, postId: ${postId}`);
                const result = await UserController.saveUserPostById(id, req.params.id);
                if (result >= 1) {
                    if (result == 1) {
                        res.json({ liked: true }).status(200);
                    } else {
                        res.json({ liked: false }).status(200);
                    }
                } else {
                    res.status(500).send();
                }
            }
        ]
    },
    {
        path: "/post/comment",
        method: "post",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkBody: true }),
            async (req: Request, res: Response) => {
                return res.status(501).send();
            }
        ]
    },
    {
        path: "/post/like",
        method: "post",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkBody: true }),
            async (req: Request, res: Response) => {
                return res.status(501).send();
            }
        ]
    },
    {
        path: "/post/dislike",
        method: "post",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkBody: true }),
            async (req: Request, res: Response) => {
                return res.status(501).send();
            }
        ]
    }
]