const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Rutgers01040104',
  database: 'employees_db',
};

async function main() {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update employee manager',
          'View employees by manager',
          'Exit',
        ],
      },
    ]);

    if (action === 'Exit') {
      console.log('Goodbye!');
      break;
    }

    switch (action) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Update employee manager':
        await updateEmployeeManager();
        break;
      case 'View employees by manager':
        await viewEmployeesByManager();
        break;
    }
  }
}

async function viewAllDepartments() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query('SELECT * FROM department');
  console.table(rows);
  await connection.end();
}

async function viewAllRoles() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query('SELECT * FROM role');
  console.table(rows);
  await connection.end();
}

async function viewAllEmployees() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query('SELECT * FROM employee');
  console.table(rows);
  await connection.end();
}

async function addDepartment() {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the department name:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  await connection.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
  await connection.end();
}

async function addRole() {
  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the role salary:',
    },
    {
      type: 'input',
      name: 'departmentId',
      message: 'Enter the department ID for the role:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  await connection.query('INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)', [title, departmentId, salary]);
  await connection.end();
}

async function addEmployee() {
  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "Enter the employee's first name:",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "Enter the employee's last name:",
    },
    {
      type: 'input',
      name: 'roleId',
      message: "Enter the employee's role ID:",
    },
    {
      type: 'input',
      name: 'managerId',
      message: "Enter the employee's manager ID (leave blank if none):",
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
    firstName,
    lastName,
    roleId,
    managerId || null,
  ]);
  await connection.end();
}

async function updateEmployeeRole() {
  const { employeeId, newRoleId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'employeeId',
      message: 'Enter the employee ID you want to update:',
    },
    {
      type: 'input',
      name: 'newRoleId',
      message: 'Enter the new role ID for the employee:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
  await connection.end();
}
async function updateEmployeeManager() {
  const { employeeId, newManagerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'employeeId',
      message: 'Enter the employee ID you want to update:',
    },
    {
      type: 'input',
      name: 'newManagerId',
      message: 'Enter the new manager ID for the employee:',
    },
  ]);
  const connection = await mysql.createConnection(dbConfig);
  await connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [newManagerId, employeeId]);
  await connection.end();
}

async function viewEmployeesByManager() {
  const { managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'managerId',
      message: 'Enter the manager ID to view their employees:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query('SELECT * FROM employee WHERE manager_id = ?', [managerId]);
  console.table(rows);
  await connection.end();
}
main();
