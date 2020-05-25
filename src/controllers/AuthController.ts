import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import config from '../config/config';

import { User } from '../entities/User';
import logger from '../utils/logger';

class AuthController {

    /**
     * @returns -2 if invalid arguments, -1 if not found or invalid password, JWT token if accepted
     */
    static login = async (username: string, password: string) => {
        if (!(username && password)) {
            return -2;
        }

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            return -1;
        }

        // Verify that encrypted password matches, if fail send 401 (unauthorized)
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            return -1;
        }

        // Sign JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        // Send the JWT token in response
        return token;
    };

    static register = async (username: string, password: string, email: string, ip: string) => {
        let user = new User();

        user.username = username;
        user.password = password;
        user.email = email;
        user.register_ip = ip;
        // Rar workaround fordi CreateDateColumn() ikke ser ut til å fungere som forventet
        user.created_at = () => 'NOW()';

        user.hashPassword()

        const errors = await validate(user);
        if (errors.length > 0) {
            logger.error(errors);
            return -1;
        }

        const userRepo = getRepository(User);
        try {
            await userRepo.insert(user);
        } catch (e) {
            logger.error(e);
            return 0;
        }

        return 1;
    };

    /**
     * @returns -1 if unauthorized, 0 if bad request, 1 if success
     */
    static changePassword = async (id: any, oldPassword: string, newPassword: string) => {
        if (!(oldPassword && newPassword)) {
            return 0;
        }

        // Get user from database, if fail send 401 (unauthorized)
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            return -1;
        }

        // Check if old password matches
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            return -1;
        }

        // Validate the model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            return 0;
        }

        // Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        // Send 204 in response (No content)
        return 1;
    };
}

export default AuthController;