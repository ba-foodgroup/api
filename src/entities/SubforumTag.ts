import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "subforum_tag" })
export class SubforumTag {
  @PrimaryColumn()
  subforum_id!: number;

  @PrimaryColumn()
  subfoum_tags_id!: number;
}
