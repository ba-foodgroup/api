import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Length, IsEmail, IsOptional } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity({name: 'user'})
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @Length(4, 45)
    username!: string;

    @Column()
    @Length(4, 256)
    @IsEmail()
    email!: string;

    @Column()
    @Length(5)
    @IsOptional()
    admin_group_id!: number;

    @CreateDateColumn()
    created_at!: any;

    @Column()
    @Length(4, 512)
    password!: string;

    @Column()
    @Length(4, 128)
    register_ip!: string;

    @Column()
    @Length(4, 512)
    @IsOptional()
    icon!: string;

    @Column()
    karma!: number;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 12);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }

}