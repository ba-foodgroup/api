import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: 'admin_group'})
export class AdminGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 45})
    name!: string;

    @Column()
    permissions!: number;
}