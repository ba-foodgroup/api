import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "subforum_post_list" })
export class SubforumPostList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  subforum_id!: number;

  @Column()
  @Length(2, 45)
  name!: string;

  @Column()
  @Length(2, 45)
  description!: string;

  @Column()
  @Length(2, 512)
  icon!: string;

  @CreateDateColumn()
  time!: Date;
}
