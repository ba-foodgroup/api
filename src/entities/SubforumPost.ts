import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "subforum_post" })
export class SubforumPost {
  @PrimaryGeneratedColumn()
  @Length(2, 45)
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  subforum_id!: number;

  @Column()
  subforum_post_list_id!: number;

  @Column()
  @Length(2, 128)
  title!: string;

  @Column()
  @Length(2, 2056)
  message!: string;

  @CreateDateColumn()
  time!: Date;
}
