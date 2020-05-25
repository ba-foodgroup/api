import { Request, Response } from 'express';
import { getConnection, getRepository, getManager, Brackets } from 'typeorm';
import { validate } from 'class-validator';
import { v4 as uiidv4 } from 'uuid';
import { promises as fs, constants as fsConstants } from 'fs';

import { User } from '../entities/User';
import { UserSettings } from '../entities/UserSettings';
import { AdminGroup } from '../entities/AdminGroup';

import logger from '../utils/logger';
import { checkIsImage } from '../utils';

import { UserPostSaved } from '../entities/UserPostSaved';
import { Subforum } from '../entities/Subforum';
import { SubforumPostList } from '../entities/SubforumPostList';
import { SubforumMember } from '../entities/SubforumMember';
import { SubforumCategory } from '../entities/SubforumCategory';
import { SubforumPromoted } from '../entities/SubforumPromoted';
import { PostRecipeDetail } from '../entities/PostRecipeDetail';
import { UploadedFile } from 'express-fileupload';

class UserController {

    /**
     * @returns User if found, -1 if not
     */
    static getUser = async (id: any, grabPrivate: boolean) => {
        // Get the user from the database
        try {
            // Select everything except password and accounts_setting.user_id
            let user = getRepository(User)
                .createQueryBuilder('user')
                .leftJoin(UserSettings, 'settings', 'settings.user_id = user.id')
                .leftJoin(AdminGroup, 'admin', 'admin.id = user.admin_group_id')
                .select(['user.id', 'user.username', 'user.created_at', 'user.icon', 'user.karma'])
                .addSelect('admin.name', 'admin_group_name')
                .addSelect('admin.permissions', 'admin_group_permissions')
                .where('user.id = :id', { id: id });

            if (grabPrivate)
                user
                    .addSelect('user.email')
                    .addSelect('user.register_ip')
                    .addSelect('settings.privacy', 'setting_privacy')
                    .addSelect('settings.notifications', 'setting_notifications');

            user = await user.getRawOne();

            return user;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    /**
     * @returns 1 if successful, 0 if not
     */
    static updateUserSettingsById = async (id: any, privacy: boolean, notifications: boolean) => {
        try {
            await getConnection()
                .createQueryBuilder()
                .update(UserSettings)
                .set({ privacy: privacy, notifications: notifications })
                .where('user_id = :id', { id: id })
                .execute();
            return 1;
        } catch (error) {
            return 0;
        }
    };

    /**
     * @returns User settings if succsesful, -1 if not
     */
    static getUserSettingsById = async (id: any) => {
        try {
            const settings = await getRepository(UserSettings)
                .createQueryBuilder('user_settings')
                .select(['privacy', 'notifications'])
                .where('user_id = :id', { id: id })
                .getRawOne();

            return settings;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    /**
     * @returns User saved posts if successful, -1 if not
     */
    static getUserSavedPostsById = async (id: any) => {
        try {
            const posts = await getRepository(UserPostSaved)
                .createQueryBuilder('saved')
                .leftJoin(User, 'user', 'user.id = saved.user_id')
                .leftJoin(SubforumPostList, 'subforum_post_list', 'subforum_post_list.id = saved.subforum_post_list_id')
                .leftJoin(Subforum, 'subforum', 'subforum.id = subforum_post_list.subforum_id')
                .select([
                    'subforum_post_list.user_id',
                    'subforum_post_list.subforum_id',
                    'subforum_post_list.name',
                    'subforum_post_list.description',
                    'subforum_post_list.icon',
                    'subforum_post_list.time',
                    'subforum.name',
                    'subforum.path',
                    'subforum.icon',
                    'saved.saved_at'
                ])
                .where('saved.user_id = :id', { id: id })
                .getRawOne();

            return posts;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static saveUserPostById = async (user_id: any, postId: any) => {
        let exists = false;
        try {
            const postSaved = await getRepository(UserPostSaved)
                .createQueryBuilder('saved')
                .innerJoin(User, 'user', 'user.id = saved.user_id')
                .select('saved.saved_at')
                .where('saved.user_id = :id', { id: user_id })
                .andWhere('saved.subforum_post_list_id = :post_id', { post_id: postId})
                .getRawOne();

            if (postSaved) {
                if (postSaved.saved_at !== null) {
                    exists = true;
                }
            }
        } catch (error) {
            return -2;
        }

        try {
            if (!exists) {
                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(UserPostSaved)
                    .values({
                        user_id: user_id,
                        subforum_post_list_id: postId,
                        saved_at: () => 'NOW()'
                    })
                    .execute();

                return 1;
            } else {
                await getConnection()
                    .createQueryBuilder()
                    .delete()
                    .from(UserPostSaved)
                    .where('subforum_post_list_id = :post_id', { post_id: postId })
                    .andWhere('user_id = :user_id', { user_id: user_id })
                    .execute();
                return 2;
            }
        } catch (error) {
            logger.error(error);
            return -1;
        }
    }

    static getUserSubforumsById = async (id: any) => {
        try {
            const subforums = await getRepository(Subforum)
                .createQueryBuilder('subforum')
                .leftJoin(SubforumMember, 'subforum_member', 'subforum_member.subforum_id = subforum.id')
                .leftJoin(SubforumCategory, 'subforum_category', 'subforum.category_id = subforum_category.id')
                .select([
                    'subforum_member.user_id',
                    'subforum_member.subforum_id',
                    'subforum_member.restrictions',
                    'subforum_member.admin_restricted',
                    'subforum.id',
                    'subforum.official',
                    'subforum.owner_user_id',
                    'subforum.name',
                    'subforum.path',
                    'subforum.description',
                    'subforum.category_id',
                    'subforum.icon',
                    'subforum.restricted'
                ])
                .addSelect('subforum_category.name', 'category_name')
                .addSelect('subforum_category.description', 'category_description')
                .where('subforum.official = 1')
                .orWhere('subforum_member.user_id = :user_id', { user_id: id })
                .getRawMany();

            return subforums;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static getUserSubforumFeedById = async (user_id: any, page: any) => {
        // maybe make a constants file or something
        const ROWS = 100;

        try {
            const feed = await getRepository(SubforumPostList)
                .createQueryBuilder('subforum_post_list')
                .leftJoin(Subforum, 'subforum', 'subforum.id = subforum_post_list.subforum_id')
                .leftJoin(SubforumMember, 'subforum_member', 'subforum_member.user_id = subforum_post_list.user_id')
                .leftJoin(SubforumPromoted, 'subforum_promoted', 'subforum_promoted.subforum_id = subforum.id')
                .leftJoin(User, 'user', 'user.id = subforum_post_list.user_id')
                .leftJoin(PostRecipeDetail, 'post_recipe_detail', 'post_recipe_detail.subforum_post_list_id = subforum_post_list.id')
                .leftJoin(UserPostSaved, 'save', 'save.subforum_post_list_id = subforum_post_list.id')
                .select([
                    'user.id',
                    'user.username',
                    'user.karma',
                    'user.icon',
                    'subforum_post_list.id',
                    'subforum_post_list.user_id',
                    'subforum_post_list.subforum_id',
                    'subforum_post_list.name',
                    'subforum_post_list.description',
                    'subforum_post_list.icon',
                    'subforum_post_list.time',
                    'subforum_post_list.upvotes',
                    'subforum_post_list.dislikes',
                    'post_recipe_detail.difficulty',
                    'post_recipe_detail.time_estimate',
                    'post_recipe_detail.cost',
                    'save.saved_at'
                ])
                .where('subforum.official = 1')
                .orWhere('subforum_member.user_id = :id', { id: user_id })
                .orWhere(new Brackets(qb => {
                    qb.where('subforum_promoted.ends IS NULL')
                        .orWhere('subforum_promoted.ends > NOW()')
                }))
                .addOrderBy('subforum_post_list.time', 'DESC')
                .addOrderBy('subforum_promoted.starts', 'ASC')
                .addOrderBy('subforum_post_list.upvotes', 'DESC')
                .take(ROWS)
                .skip((page == 0) ? (0) : (page * ROWS))
                .getRawMany();

                return feed;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static unlinkUserAvatar = async (user_id: any) => {
        const avatar = await getRepository(User)
            .createQueryBuilder('user')
            .select(['user.icon'])
            .where('user.id = :id', { id: user_id })
            .getRawOne();

        console.log(avatar.user_icon);
        if (avatar.user_icon !== null) {
            console.log(avatar.user_icon);

            // TODO: Constants file
            const AVATAR_UPLOAD_DIRECTORY = `${process.env.STATIC_CONTENT_PATH}/avatars/`;
            fs.unlink(AVATAR_UPLOAD_DIRECTORY + avatar.user_icon);
        }

        return 1;
    }

    static setUserAvatar = async (user_id: any, avatar: UploadedFile) => {
        // File isn't in the list of allowed extensions
        if (!checkIsImage(avatar)) {
            return -1;
        }

        const uniqId = `${uiidv4()}.${avatar.name.split('.').pop()}`;

        // TODO: constants file?
        const AVATAR_UPLOAD_DIRECTORY = `${process.env.STATIC_CONTENT_PATH}/avatars/`;

        const newPath = AVATAR_UPLOAD_DIRECTORY + uniqId;

        try {
            await avatar.mv(newPath);

            logger.info('Moved to ' + newPath);

            await UserController.unlinkUserAvatar(user_id);

            getRepository(User)
                .createQueryBuilder()
                .update()
                .set({ icon: uniqId })
                .where('user.id = :id', { id: user_id })
                .execute();

            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };
};

export default UserController; 