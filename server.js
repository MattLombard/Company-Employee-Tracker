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
  //  add a role goes here
}

async function addEmployee() {
  //  add an employee goes here
}

async function updateEmployeeRole() {
  //  update an employee role goes here
}

main();
