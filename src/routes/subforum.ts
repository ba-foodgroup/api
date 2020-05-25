import { Request, Response } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkJwt';
import {checkSubforumPermission} from '../middlewares/checkSubforumPermission';
import SubforumController from '../controllers/SubforumController';



export default [
    {
        path: "/subforum/:id([0-9]+)",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;
                const subforum = await SubforumController.getSubforumById(id);

                if (subforum !== -1) {
                    res.status(200).json(subforum);
                } else {
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/subforum/rules",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/rules",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;
                const subforumRules = await SubforumController.getSubforumRules(id);

                if (subforumRules !== -1) {
                    res.status(200).json(subforumRules);
                } else {
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/subforum/categories",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                const categories = await SubforumController.getAllSubforumCategories();

                if (categories !== -1) {
                    res.status(200).json(categories);
                } else {
                    res.status(500);
                }
            }
        ]
    },
    {   // Pretty useless route, was meant to be for all subforum categories initially
        path: "/subforum/:id([0-9]+)/category",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;
                const category = await SubforumController.getSubforumCategory(id);

                if (category !== -1) {
                    res.status(200).json(category);
                } else {
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/subforum/tags",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/tags",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                const { id = -1 } = req.params;
                const tags = await SubforumController.getSubforumTags(id);

                if (tags !== -1) {
                    res.status(200).json(tags);
                } else {
                    res.status(500);
                }
                return;
            }
        ]
    },
    {
        path: "/subforum/feed",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/feed/:page([0-9]+)",
        method: "get",
        handler: [
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/feed",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                // Finn ut om vi vil tillate uten JWT autensiering her
                // Må i så fall verifisere at subforumet ikke er privat
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/feed/:page([0-9]+)",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                // Finn ut om vi vil tillate uten JWT autensiering her
                // Må i så fall verifisere at subforumet ikke er privat
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/members",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/members/staff",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/:id([0-9]+)/sticky",
        method: "get",
        handler: [
            checkJwt,
            checkSubforumPermission({ checkMembership: true }),
            async (req: Request, res: Response) => {
                return res.status(501);
            }
        ]
    },
    {
        path: "/subforum/create",
        method: "post",
        handler: [
            checkJwt,
            async ( req: Request, res: Response) => {
                const { name, description } = req.body;
                const tags = await SubforumController.createSubforum(name, description);

                if (tags !== -1) {
                    res.status(200).json(tags);
                } else {
                    // Internal server error
                    res.send(500).send
                }
                return;

            }
        ]
    }
];
