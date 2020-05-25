import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "subforum_rule" })
export class SubforumRule {
  @PrimaryColumn()
  subforum_id!: number;

  @PrimaryColumn()
  subforum_rule_list_id!: number;

  @CreateDateColumn()
  added_date!: Date;

  @Column()
  added_by_user_id!: number;
}
