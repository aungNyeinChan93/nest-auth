/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class UploadImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: File;

    @CreateDateColumn()
    created_at: Date;


    @UpdateDateColumn()
    updated_at: Date;
}
