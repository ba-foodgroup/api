import { Entity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity({ name: 'subforum_member' })
export class SubforumMember {
    @PrimaryColumn()
    user_id!: number;

    @PrimaryColumn()
    subforum_id!: number;

    @Column()
    @CreateDateColumn()
    joined_date!: Date;

    @Column()
    subforum_group_id!: number;

    @Column()
    restrictions!: boolean;

    @Column()
    admin_restricted!: boolean;
};