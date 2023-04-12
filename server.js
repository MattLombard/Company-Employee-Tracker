const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const inquirer = require('inquirer');

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
  // display departments goes here
}

async function viewAllRoles() {
  //  display roles goes here
}

async function viewAllEmployees() {
  //  display employees goes here
}

async function addDepartment() {
  //  add a department goes here
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
