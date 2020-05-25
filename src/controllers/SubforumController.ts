import logger from "../utils/logger";
import { getRepository, getConnection, getManager } from "typeorm";
import { Subforum } from "../entities/Subforum";
import { User } from "../entities/User";
import { SubforumCategory } from "../entities/SubforumCategory";
import { SubforumRule } from "../entities/SubforumRule";
import { SubforumRuleList } from "../entities/SubforumRuleList";
import subforum from "../routes/subforum";
import { SubforumTagList } from "../entities/SubforumTagList";
import { SubforumTag } from "../entities/SubforumTag";
import { validate } from "class-validator";
import { SubforumPostSticky } from "../entities/SubforumPostSticky";
import { SubforumPost } from "../entities/SubforumPost";
import { SubforumPostList } from "../entities/SubforumPostList";
import { PostRecipeDetail } from "../entities/PostRecipeDetail";
import { PostRecipeItem } from "../entities/PostRecipeItem";
import { UploadedFile } from 'express-fileupload';
import { checkIsImage } from '../utils';
import { v4 as uiidv4 } from 'uuid';
import { promises as fs, constants as fsConstants } from 'fs';
import { SubforumMember } from "../entities/SubforumMember";
import { SubforumPromoted } from "../entities/SubforumPromoted";

interface SubforumGeneralPostValues {
    subforum_id: number,
    name: string,
    description: string
}

interface SubforumRecipePostValues {
    subforum_post_list_id: number,
    difficulty: number;
    time_estimate: number,
    items: RecipeItem[]
}

interface RecipeItem {
    name: string,
    cost: number,
    retailer?: string
}

class SubforumController {

    static getSubforumById = async(id: any) => {
        try {
            const subforum = await getRepository(Subforum)
                .createQueryBuilder("subforum")
                    .leftJoin(User, "user", "user.id = subforum.ower_user")
                    .leftJoin(SubforumCategory, "sc", "sc.id = subforum.category_id")
                    .select(["name", "owner_user", "category_id", "description"])
                    .where('subforum.id = :id', { id: id })
                    .getRawOne();
              return subforum;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static createSubforum = async(name: any, description: any) => {
        let subforum = new Subforum();
        subforum.name = name;
        subforum.description = description;

        const errors = await validate(subforum);
        if (errors.length > 0) {
            logger.error(errors);
            return -1;
        }

        const subforumRepo = getRepository(Subforum);
        try {
            await subforumRepo.save(subforum);
        } catch (error) {
            logger.error(error);
            return 0;
        }

        return 1;
    };

    static getSubforumRules = async(id: any) => {
        try {
            const subforumRules = await getRepository(SubforumRuleList)
                .createQueryBuilder("subforum_rule_list")
                    .leftJoin(SubforumRule, "sr", "sr.id = subforum_rule_list.id")
                    .leftJoin(Subforum, "subforum", "subforum.id = sr.id" )
                    .select(["name", "description"])
                    .where("subforum_rule_list.id = :id", {id: id});
            return subforumRules;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static getAllSubforumCategories = async() => {
        try {
            const subforumCategories = await getRepository(SubforumCategory)
                .createQueryBuilder("category")
                .select(["id", "name", "description"])
                .getRawMany();

            return subforumCategories;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    }

    static getSubforumCategory = async(id: any) => {
        try {
            const subforumCategory = await getRepository(SubforumCategory)
            .createQueryBuilder("subforum_category")
                .leftJoin(Subforum, "subforum", "subforum.category_id = subforum_category.id")
                .select(["name", "description"])
                .where("subforum.id = :id", {id: id})
                .getRawOne();
            return subforumCategory;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static getSubforumTags = async(id: any) => {
        try {
            const subforumTags = await getRepository(SubforumTagList)
            .createQueryBuilder("subforum_tag_list")
                .leftJoin(SubforumTag, "subforum_tag", "subforum_tag.subforum_tags_id = subforum_tag_list.id")
                .leftJoin(Subforum, "subforum", "subforum.id = subforum_tag.subforum_id")
                .select(["title", "description"])
                .where("subforum.id = :id", { id: id })
                .getRawMany();
            return subforumTags;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static getSubforumSticky = async(id: any) => {
        try {
            const subforumPostSticky = await getRepository(SubforumPostSticky)
            .createQueryBuilder("subforum_sticky")
                .leftJoin(Subforum, "subforum", "subforum.id = subform_sticky.subforum_id")
                .leftJoin(SubforumPost, "subforum_post", "subforoum_post.id = subforum_sticky.subforum_post_id")
                .leftJoin(User, "user", "user.id = subforum_sticky.sticked_by_user_id")
                .select(["subforum_id", "subforum_post_id", "sticked_at"])
                .addSelect("sticked_by_user", "sticked_by_user_id")
                .where("subforum_sticky.subforum_id = :id", { id: id })
                .getRawMany();
            return subforumPostSticky;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    };

    static getSubforumPostOverview = async(id: any) => {
        /**
         * TODO: Må ha sjekker for hvorvidt bruker har tilgang til å se innholdet også!
         */
        try {
            const subforumPost = await getRepository(SubforumPostList)
                .createQueryBuilder('subforum_post_list')
                .leftJoin(Subforum, 'subforum', 'subforum.id = subforum_post_list.subforum_id')
                .leftJoin(SubforumMember, 'subforum_member', 'subforum_member.user_id = subforum_post_list.user_id')
                .leftJoin(User, 'user', 'user.id = subforum_post_list.user_id')
                .leftJoin(PostRecipeDetail, 'post_recipe_detail', 'post_recipe_detail.subforum_post_list_id = subforum_post_list.id')
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
                    'post_recipe_detail.cost'
                ])
                .where('subforum_post_list.id = :id', { id: id })
                .getRawOne();

            return subforumPost;
        } catch (error) {
            logger.error(error);
            return -1;
        }
    }

    static postToSubforumGeneral = async(user_id: number, values: SubforumGeneralPostValues) => {
        var date = new Date().getDate();
        let postListId;
        try {
            const postListIdQuery = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(SubforumPostList)
                .values(
                    {
                        user_id: user_id,
                        subforum_id: values.subforum_id,
                        name: values.name,
                        description: values.description,
                        time: () => 'NOW()'
                    }
                )
                .execute();

            logger.debug(postListIdQuery);

            postListId = postListIdQuery.raw.insertId;

        } catch (error) {
            logger.error(error);
            return -1;
        }

        return postListId;
    };

    static postToSubforumRecipe = async (user_id: number, values: SubforumRecipePostValues) => {
        let recipeId: number;
        try {
            // The design is kind of awkward here.
            // It would have been better to not require the postListId, and instead
            // create the post here itself. This way we would avoid having to check the post owner

            const post = await getRepository(SubforumPostList)
                .createQueryBuilder('post_list')
                .select('user_id')
                .where('id = :id', { id: values.subforum_post_list_id })
                .getRawOne();

            if (post.user_id != user_id) {
                // Not the owner of the post
                return 0;
            }

            const recipeIdQuery = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(PostRecipeDetail)
                .values(
                    {
                        subforum_post_list_id: values.subforum_post_list_id,
                        difficulty: values.difficulty,
                        time_estimate: values.time_estimate,
                    }
                )
                .execute();

            recipeId = recipeIdQuery.raw.insertId;

            let saveItem;
            let saveItems: PostRecipeItem[] = [];
            values.items.forEach((item) => {
                saveItem = new PostRecipeItem();
                saveItem.recipe_id = recipeId;
                saveItem.name = item.name;
                saveItem.cost = item.cost;
                if (item.retailer) {
                    saveItem.retailer = item.retailer;
                }
                saveItems.push(saveItem);
            });

            await getRepository(PostRecipeItem)
                .save(saveItems);
        } catch (error) {
            logger.error(error);
            return -1;
        }

        return recipeId;
    };

    static unlinkPostImage = async (user_id: any) => {
        const icon = await getRepository(SubforumPostList)
            .createQueryBuilder('post')
            .select(['post.icon'])
            .where('post.id = :id', { id: user_id })
            .getRawOne();

        console.log(icon.post_icon);
        if (icon.post_icon !== null) {
            console.log(icon.post_icon);

            // TODO: Constants file
            const ICON_UPLOAD_DIRECTORY = `${process.env.STATIC_CONTENT_PATH}/post_icons/`;
            fs.unlink(ICON_UPLOAD_DIRECTORY + icon.post_icon);
        }

        return 1;
    }

    static setPostImage = async (post_id: any, icon: UploadedFile) => {
        // File isn't in the list of allowed extensions
        if (!checkIsImage(icon)) {
            return -1;
        }

        const uniqId = `${uiidv4()}.${icon.name.split('.').pop()}`;

        // TODO: constants file?
        const ICON_UPLOAD_DIRECTORY = `${process.env.STATIC_CONTENT_PATH}/post_icons/`;

        const newPath = ICON_UPLOAD_DIRECTORY + uniqId;

        try {
            await icon.mv(newPath);

            logger.info('Moved to ' + newPath);

            await SubforumController.unlinkPostImage(post_id);

            getRepository(SubforumPostList)
                .createQueryBuilder()
                .update()
                .set({ icon: uniqId })
                .where('post.id = :id', { id: post_id })
                .execute();

            return 1;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

};

export default SubforumController;