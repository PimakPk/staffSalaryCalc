import { DataSource } from 'typeorm';
import { Staff } from './src/staff/staff.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Staff],
  synchronize: true, 
});

async function seed() {
  await AppDataSource.initialize();

  const staffRepository = AppDataSource.getRepository(Staff);
  
  // Створюємо Sales
  const sales = new Staff();
  sales.name = 'Bob Sales';
  sales.role = 'Sales';
  sales.dateJoin = new Date('2018-09-01');
  sales.baseSalary = 50000;
//   sales.supervisor = manager;
  await staffRepository.save(sales);
  
  // Створюємо менеджера
  const manager = new Staff();
  manager.name = 'Alice Manager';
  manager.role = 'Manager'; // SQLite не підтримує enum, тому використовуємо string
  manager.dateJoin = new Date('2015-06-15');
  manager.baseSalary = 60000;
  manager.supervisor = sales;
  await staffRepository.save(manager);


  // Створюємо Employee
  const employee = new Staff();
  employee.name = 'Charlie Employee';
  employee.role = 'Employee';
  employee.dateJoin = new Date('2020-02-10');
  employee.baseSalary = 40000;
  employee.supervisor = manager;
  await staffRepository.save(employee);

  console.log('✅ Тестові дані додані в базу');
  await AppDataSource.destroy();
}

async function clearDatabase() {
    await AppDataSource.initialize();
    const staffRepository = AppDataSource.getRepository(Staff);
  
    await staffRepository.clear(); 
  
    console.log('🗑️ Всі дані з таблиці Staff видалені');
    await AppDataSource.destroy();
  }
  
// clearDatabase().catch((err) => console.error('❌ Помилка:', err));
  

seed().catch((err) => console.error('❌ Помилка:', err));
