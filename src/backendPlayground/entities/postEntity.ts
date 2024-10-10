import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { PostVisibility } from '../enums/postVisibility'

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    userId!: number

    @Column()
    title!: string

    @Column('text')
    content!: string

    @Column({
        type: 'enum',
        enum: PostVisibility,
        default: PostVisibility.PUBLIC
    })
    visibility!: PostVisibility

    @CreateDateColumn()
    dateCreated?: Date

    @UpdateDateColumn()
    dateUpdated?: Date
}