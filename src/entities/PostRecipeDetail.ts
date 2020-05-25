import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'subforum_post_list_recipe_detail' })
export class PostRecipeDetail {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    subforum_post_list_id!: number;

    @Column()
    difficulty!: number;

    @Column()
    time_estimate!: number;

    @Column()
    cost!: number;

};