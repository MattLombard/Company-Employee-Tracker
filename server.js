const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function main() {
  while (true) {
    // Prompt the user to select an action to perform
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
          'View employees by department',
          'Exit',
        ],
      },
    ]);
    // Check if the user selected "Exit", and break out of the loop if so
    if (action === 'Exit') {
      console.log('Goodbye!');
      break;
    }
    // Call the appropriate function based on the user's selected action

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
      case 'View employees by department':
        await viewEmployeesByDepartment();
        break;
    }
  }
}

async function viewAllDepartments() {
  // Connect to the database
  const connection = await mysql.createConnection(dbConfig);
  // Query the database for all departments
  const [rows] = await connection.query('SELECT * FROM department');
  // Log the results to the console
  console.table(rows);
  // Close the connection
  await connection.end();
}

async function viewAllRoles() {
  // Connect to the database
  const connection = await mysql.createConnection(dbConfig);
  // Query the database for all roles
  const [rows] = await connection.query('SELECT * FROM role');
  // Log the results to the console
  console.table(rows);
  // Close the connection
  await connection.end();
}

async function viewAllEmployees() {
  const connection = await mysql.createConnection(dbConfig);
  const [rows] = await connection.query('SELECT * FROM employee');
  console.table(rows);
  await connection.end();
}

async function addDepartment() {
  // Prompt the user for the name of the department they want to add
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the department name:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  // Insert the department into the database
  await connection.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
  await connection.end();
}

async function addRole() {
  // Prompt the user for the role title, salary, and department ID
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
  // Prompt the user for the employee's first name, last name, role ID, and manager ID
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
  // Prompt the user for the employee ID and new role ID
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
  // Prompt the user for the employee ID and new manager ID
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
  console.log('Employee updated!');
  await connection.end();
}

async function viewEmployeesByManager() {
  // Prompt the user for the manager ID they want to view
  const { managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'managerId',
      message: 'Enter the manager ID to view their employees:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  // Query the database for all employees with the manager ID
  const [rows] = await connection.query('SELECT * FROM employee WHERE manager_id = ?', [managerId]);
  console.table(rows);
  await connection.end();
}

async function viewEmployeesByDepartment() {
  // Prompt the user for the department ID they want to view
  const { departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentId',
      message: 'Enter the department ID to view its employees:',
    },
  ]);

  const connection = await mysql.createConnection(dbConfig);
  // Query the database for all employees in the department
  const [rows] = await connection.query(
    'SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.department_id = ?',
    [departmentId]
  );
  console.table(rows);
  await connection.end();
}

main();
