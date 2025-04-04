import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/createStaff.dto';

@Injectable()
export class StaffService {
    constructor(
        @InjectRepository(Staff)
        private staffRepository: Repository<Staff>
    ) {}

    employeePercent: number = 0.03;
    employeeLimit: number = 0.3;
    managerPercent: number = 0.05;
    managerLimit: number = 0.4;
    managerPercentSubordinates: number = 0.005;
    salesPercent: number = 0.01;
    salesLimit: number = 0.35;
    salesPercentSubordinates: number = 0.003;

    findAll() : Promise<Staff[]> {
        return this.staffRepository.find();
    }

    async checkId(id: number) : Promise<void> {
        const staff = await this.staffRepository.findOneBy({id});
        if (!staff) {
            throw new NotFoundException('Staff by this id is not provided');
        }
    }

    findOne(id: number) : Promise<Staff | null> {
        return this.staffRepository.findOneBy({id});
    }

    async getSalary(id: number): Promise<number> {
        const staff = await this.staffRepository.findOne({
            where: {id},
            relations: ['supervisor']
        });
        if (!staff) { // проблемне місце, дублювання коду
            throw new NotFoundException('Staff by this id is not provided');
        }
        // console.log(staff);

        let salary = staff?.baseSalary;
        let dateJoin = new Date(staff?.dateJoin);
        let now = new Date();
        let yearsWorked = now.getFullYear() - dateJoin.getFullYear(); // not supported mounth and days
        if (yearsWorked != 0 && now.getMonth() < dateJoin.getMonth()) {
            yearsWorked -= 1;
        }else if (yearsWorked != 0 && now.getMonth() === dateJoin.getMonth() && now.getDate() < dateJoin.getDate()) {
            yearsWorked -= 1;
        }
        // console.log(yearsWorked);
        let percent : number;
        switch (staff.role) {
            case ('Employee'):
                percent = this.employeePercent * yearsWorked > this.employeeLimit ? this.employeeLimit : this.employeePercent * yearsWorked;
                salary += percent * salary;
                break;
            case ('Manager'):
                percent = this.managerPercent * yearsWorked > this.managerLimit ? this.managerLimit : this.managerPercent * yearsWorked;
                salary += percent * salary;
                break;
            case ('Sales'):
                percent = this.salesPercent * yearsWorked > this.salesLimit ? this.salesLimit : this.salesPercent * yearsWorked;
                salary += percent * salary;
                break;
        }

        // console.log(salary)

        const subordinates = await this.staffRepository.findBy({supervisor: staff});
        // console.log(subordinates);

        let bonus: number;
        switch (staff.role) {
            case ('Manager'):
                bonus = subordinates.reduce((acc, current) => acc + current.baseSalary * this.managerPercentSubordinates, 0);
                salary += bonus;
                break;
            case ('Sales'):
                bonus = subordinates.reduce((acc, current) => acc + current.baseSalary * this.salesPercentSubordinates, 0);
                salary += bonus;
                break;
        }

        return salary;
    }

    async getAllSalary(): Promise<number> {
        const allStaff = await this.staffRepository.find();
        const allStaffSalary = await Promise.all(allStaff.map((staff) => this.getSalary(staff.id)));
        // console.log(allStaffSalary);
        const sumSalary = allStaffSalary.reduce((acc, current) => acc + current, 0)
        return sumSalary;
    }

    async createStaff(createStaffDto: CreateStaffDto) {
        let supervisor: Staff | null;

        if (createStaffDto.supervisorId) {
            supervisor = await this.staffRepository.findOneBy({id: createStaffDto.supervisorId});
            if (!supervisor) {
                throw new NotFoundException('Supervisor not found');
            }
            if (supervisor.role === 'Employee') {
                throw new BadRequestException('Employee can not be a Supervisor');
            }
            if (createStaffDto.role === 'Sales' && supervisor.role === 'Manager') {
                throw new BadRequestException('Manager can not be a Supervisor for Sales');
            }
        } else {
            supervisor = null
        }
        
        const staff = this.staffRepository.create({
            name: createStaffDto.name,
            dateJoin: createStaffDto.dateJoin,
            role: createStaffDto.role,
            baseSalary: createStaffDto.baseSalary,
            supervisor: supervisor
        });

        return await this.staffRepository.save(staff);
    }
}
