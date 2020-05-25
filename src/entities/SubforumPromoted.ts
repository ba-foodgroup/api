import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "subforum_promoted" })
export class SubforumPromoted {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  promoted_by_admin_id!: number;

  @Column()
  subforum_id!: number;

  @CreateDateColumn()
  starts!: Date;

  @Column()
  ends!: Date;
}
