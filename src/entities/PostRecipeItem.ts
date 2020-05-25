import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsOptional } from 'class-validator';

@Entity({ name: 'subforum_post_list_recipe_item' })
export class PostRecipeItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    recipe_id!: number;

    @Column()
    @Length(2, 64)
    name!: string;

    @Column()
    cost!: number;

    @Column()
    @Length(2, 64)
    @IsOptional()
    retailer!: string;

};