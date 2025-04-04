import { IsDateString, IsEnum, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CreateStaffDto {
    @IsString()
    name: string;

    @IsDateString()
    dateJoin: Date;

    @IsIn(['Employee', 'Manager', 'Sales'])
    role: 'Employee' | 'Manager' | 'Sales';

    @Min(0)
    @IsNumber()
    baseSalary: number;

    @IsOptional()
    @IsNumber()
    supervisorId?: number;

}