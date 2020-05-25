import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Length } from 'class-validator';

@Entity({ name: 'subforum' })
export class Subforum {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    official!: number;

    @Column()
    owner_user_id!: number;

    @Column()
    @Length(2, 45)
    name!: string;

    @Column()
    @Length(2, 45)
    path!: string;

    @Column()
    category_id!: number;

    @Column()
    @Length(10, 256)
    description!: string;

    @Column()
    @Length(10, 512)
    icon!: string;

    @Column()
    restricted!: boolean;
};