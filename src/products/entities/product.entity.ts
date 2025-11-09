/* eslint-disable prettier/prettier */
import { Category } from "src/categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ length: 100 })
    name: string;

    @Column()
    price: number;

    @Column()
    qty: number;

    @ManyToOne(() => Category, (category) => category?.products)
    category: Category;


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
