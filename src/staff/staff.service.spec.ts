import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/createStaff.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('StaffService', () => {
  let service: StaffService;
  let repo: jest.Mocked<Repository<Staff>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: getRepositoryToken(Staff),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findBy: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    repo = module.get(getRepositoryToken(Staff));
  });

  it('should calculate salary for Employee with cap at 30%', async () => {
    const mockStaff: Staff = {
      id: 1,
      name: 'Test Emp',
      role: 'Employee',
      baseSalary: 1000,
      dateJoin: new Date('2000-01-01'),
      supervisor: null
    };

    repo.findOne.mockResolvedValueOnce(mockStaff);
    repo.findBy.mockResolvedValueOnce([]);

    const salary = await service.getSalary(1);
    expect(salary).toBe(1300); // 30% cap
  });

  it('should throw error if supervisor not found on create', async () => {
    const dto: CreateStaffDto = {
      name: 'New Guy',
      dateJoin: new Date('2020-01-01'),
      role: 'Manager',
      baseSalary: 1000,
      supervisorId: 42
    };

    repo.findOneBy.mockResolvedValue(null);

    await expect(service.createStaff(dto)).rejects.toThrow(NotFoundException);
  });
});