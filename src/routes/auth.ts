import { Request, Response } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkJwt';

export default [
    {
        path: "/auth/login",
        method: "post",
        handler: [
            async (req: Request, res: Response) => {
                const { username, password } = req.body;
                const token = await AuthController.login(username, password);

                // Invalid request
                if (token == -2) {
                    res.status(400).send();
                } else if (token == -1) {
                    // Authenciation error, passwords doesn't match
                    res.status(401).send();
                } else {
                    res.status(200).send(token);
                }
            }
        ]
    },
    {
        path: "/auth/register",
        method: "post",
        handler: [
            async (req: Request, res: Response) => {
                const ipIndex = req.ip.lastIndexOf(':') + 1;
                const ip = req.ip.substr(ipIndex, req.ip.length - ipIndex);

                const { username, password, email } = req.body;

                const test = await AuthController.register(username, password, email, ip);
                if (test == -1) {
                    // Validation error
                    res.status(400).send();
                } else if (test == 0) {
                    // conflict, username already taken?
                    res.status(409).send();
                } else if (test == 1) {
                    const token = await AuthController.login(username, password);

                    res.status(200).send(token);
                }
            }
        ]
    },
    {
        path: "/auth/change-password",
        method: "post",
        handler: [
            checkJwt,
            async (req: Request, res: Response) => {
                // Get parameters from the body
                const { oldPassword, newPassword } = req.body;

                const success = await AuthController.changePassword(res.locals.jwtPayload.userId, oldPassword, newPassword);
                if (success === -1) {
                    res.status(401).send();
                } else if (success === 0) {
                    res.status(400).send();
                } else if (success === 1) {
                    res.status(204).send();
                }
            }
        ]
    }
];
