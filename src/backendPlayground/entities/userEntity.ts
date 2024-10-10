import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import "reflect-metadata"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number | null

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    email!: string

    @Column({ type: 'varchar', nullable: true })
    phone?: string | null;

    @Column({ type: 'varchar', nullable: true })
    dateOfBirth?: string | null;
}
