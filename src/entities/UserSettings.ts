import { Entity, PrimaryColumn, Column} from "typeorm";

@Entity({ name: 'user_settings' })
export class UserSettings {

    @PrimaryColumn("int")
    user_id!: number;

    @Column()
    privacy!: boolean;

    @Column()
    notifications!: boolean;

}