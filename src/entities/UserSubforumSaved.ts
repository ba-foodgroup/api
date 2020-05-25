import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";
@Entity({name: 'user_subforum_saved'})
export class UserSubforumSaved {
    @PrimaryColumn()
    user_id!: number;

    @Column()
    subforum_id!: number;

    @CreateDateColumn()
    saved_at!: Date;
}
