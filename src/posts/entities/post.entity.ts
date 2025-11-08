/* eslint-disable prettier/prettier */
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    title: string;


    @Column()
    body: string;


    @ManyToOne(() => User, (user) => user?.posts)
    author: User;


    @CreateDateColumn()
    created_at: Date;


    @UpdateDateColumn()
    updated_at: Date
}
