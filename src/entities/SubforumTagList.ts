import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "subforum_tag_list" })
export class SubforumTagList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  @Length(1, 128)
  description!: string;

  @Column()
  @Length(1, 45)
  subforum_tag_listcol!: string;
}
