import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Staff {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'date'})
    dateJoin: Date;

    @Column({type: 'text'})
    role: 'Employee' | 'Manager' | 'Sales';

    @Column()
    baseSalary: number;

    @ManyToOne(type => Staff, (staff) => staff, {nullable: true})
    supervisor: Staff | null;

    // @OneToMany(type => Staff, (staff) => staff.supervisor)
    // subordinates: Staff[];
}