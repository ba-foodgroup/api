import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "subforum_rule_list" })
export class SubforumRuleList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(2, 64)
  name!: string;

  @Column()
  @Length(2, 256)
  descrition!: string;

  @Column()
  suggested_category_id!: number;
}
