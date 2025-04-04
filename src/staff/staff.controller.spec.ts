// src/staff/staff.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';


describe('StaffController', () => {
  let controller: StaffController;
  let mockService: Partial<Record<keyof StaffService, jest.Mock>>;

  beforeEach(async () => {
    mockService = {
      findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
      getSalary: jest.fn().mockResolvedValue(1500),
      getAllSalary: jest.fn().mockResolvedValue(5000),
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'John' }),
      createStaff: jest.fn().mockResolvedValue({ id: 2, name: 'New' }),
      checkId: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
  });

  it('should return all staff', async () => {
    const result = await controller.getAll();
    expect(result).toEqual([{ id: 1, name: 'John' }]);
  });

  it('should return total salary', async () => {
    const result = await controller.getAllSalary();
    expect(result).toBe(5000);
  });

  it('should return one salary by id', async () => {
    const result = await controller.getSalaryById(1);
    expect(result).toBe(1500);
  });

  it('should return one staff member', async () => {
    const result = await controller.getOne(1);
    expect(result).toEqual({ id: 1, name: 'John' });
  });

  it('should create a new staff member', async () => {
    const result = await controller.createStaff({} as any);
    expect(result).toEqual({ id: 2, name: 'New' });
  });
});
