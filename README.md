Було реалізовано
- Сутність Staff з полями айді, ім'я, дата (коли влаштувався працювати), базова зарплата, роль (Employee, Manager and Sales), supevisor (ставлення багато одного).
Контролери:
- Отримання списку всіх співробітників (get /staff)
- Отримання співробітника з айді (/staff/:id)
- Отримання зарплати співробітника з айді (/staff/:id/salary)
- Отримання зарплати всіх співробітників (/staff/salary)
- Створення нового співробітника (post/staff)
та Сервіси до них.
Зарплата обчислювалася щодо першого кола підлеглих, без рекурсії.
Також було зроблено обробку помилок пов'язаних не правильним введеним айді, створення запису нових підлеглих, які не дотримуються ієрархії компанії (у Employee наявність підлеглих, у Sales - керівник Manager).

Для валідації нових співробітників було створено CreateStaffDto.
Було створено тести для перевірки базового функціоналу контролерів та сервісів.

Плюси цієї архітектури:
 - Зроблено окремим модулем, що дозволяє підключити його до інших проектів.
 - Зроблено декомпозицію, дозволяє переробляти, покращувати модуль не змінюючи весь код повністю.
Контролер відповідає за маршрутизацію та формат відповіді.
Сервіс реалізує бізнес-логіку та звернення до бази даних.
DTO та пайпи – за валідацію вхідних даних.

Подальше покращення:
 - Оптимізувати роботу з бд, не отримувати запис співробітника для обробки помилок, та вдруге для роботи з нею.
 - У контролерах зробити висновок результату об'єктом із полями status, message, data, count.
 - Зробити валідацію вхідних даних на рівні моделі бд, наприклад, за допомогою mongoose.
 - створити кастомний Pipe для валідації параметра (/:id).
 - Створити контролери для редагування та видалення співробітників


TEST TASK
BACKEND DEVELOPER
Description
There is a company; the company can have staff members. Staff members are characterized
by their name, date when they joined the company, and base salary (to keep it simple,
consider this value to be equal for all staff member types by default.)
There are three types of staff members: Employee, Manager, and Sales. Any staff member
can have a supervisor. Likewise, any staff member except for Employee can have
subordinates.
Employee salary - base salary plus 3% for each year they have worked with the company,
but not more than 30% of the base salary.
Manager salary - base salary plus 5% for each year they have worked with the company (but
not more than 40% of the base salary), plus 0.5% of the salaries of their first-level
subordinates.
Sales salary - base salary plus 1% for each year they have worked with the company (but not
more than 35% of the base salary) plus 0.3% of the salaries of their subordinates of any level.
Staff members (except Employees) can have any number of subordinates.
Requirements
Create a nest.js app that describes this model, exposes API, and implements an algorithm
that calculates the salary of any staff member at an arbitrary time (as well as calculates the
sum of salaries of all staff members of the company).
The system must be verified by tests (full code coverage is not necessary, but the tests
should demonstrate that the business logic works correctly).
In addition, prepare a brief description of the solution for the test assignment, including a
description of its architecture, advantages, and drawbacks (what can be changed or
improved in the solution to make it ready for real-world usage.)
An SQLite as a database could be used or make the data model transient.
https://dbbsoftware.com