import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "subforum_category" })
export class SubforumCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(2, 62)
  name!: string;

  @Column()
  @Length(2, 512)
  description!: string;
}
