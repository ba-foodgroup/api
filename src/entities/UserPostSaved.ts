import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "user_post_saved" })
export class UserPostSaved {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  @Length(2, 45)
  subforum_post_list_id!: string;

  @CreateDateColumn()
  saved_at!: Date;
}