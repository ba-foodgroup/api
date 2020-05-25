import { Entity, PrimaryColumn,  Column, CreateDateColumn } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "subforum_post_sticky" })
export class SubforumPostSticky {
  @PrimaryColumn()
  subforum_id!: number;

  @PrimaryColumn()
  @Length(2, 45)
  subforum_post_id!: number;

  @CreateDateColumn()
  stickied_at!: Date;

  @Column()
  sticked_by_user!: number;
}
