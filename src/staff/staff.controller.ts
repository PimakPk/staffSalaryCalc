import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/createStaff.dto';

@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) {};

    @Get()
    async getAll() {
        return await this.staffService.findAll();
    }

    @Get('/salary')
    async getAllSalary() {
        return await this.staffService.getAllSalary();
    }

    @Get('/:id/salary')
    async getSalaryById(@Param('id', ParseIntPipe) id: number) {
        await this.staffService.checkId(id);
        return await this.staffService.getSalary(id);
    }

    @Get('/:id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        await this.staffService.checkId(id);
        return await this.staffService.findOne(id);
    }

    @Post() 
    async createStaff(@Body() createDto: CreateStaffDto) {
        return await this.staffService.createStaff(createDto);
    }
}
