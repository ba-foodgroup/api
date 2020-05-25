import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'subforum_member_group'})
export class SubforumMemberGroup {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 45 })
    name!: string;

    @Column()
    permissions!: number;

};