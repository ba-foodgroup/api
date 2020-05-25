import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "subforum_pending_invite" })
export class SubforumPendingInvite {
  @PrimaryColumn()
  subforum_id!: number;

  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  target_id!: number;

  @Column()
  time!: Date;
}