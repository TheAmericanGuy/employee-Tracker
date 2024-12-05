const inquirer = require('inquirer');
const pool = require('../db/db');

const menu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Welcome to Graph! Select what you wish to do!',
            choices: [
                'All Departments',
                'All Roles',
                'All Employees',
                'Add a Department',
                'Add a Role',
                'Add a Employee',
                'Update an Employee',
                'Exit',
            ],
        },
    ]);

    switch (action) {
        case 'All Departments':
            await viewDepartments();
            break;
        case 'All Roles':
            await viewRoles();
            break;
        case 'All Employees':
            await viewEmployees();
            break;
        case 'Add a Department':
            await addDepartment();
            break;
        case 'Add a Role':
            await addRole();
            break;
        case 'Add a Employee':
            await addEmployee();
            break;
        case 'Update an Employee':
            await updateEmployeeRole();
            break;
        default:
            console.log('Exiting...');
            pool.end();
            process.exit();
    }

    await menu(); 
};

const viewDepartments = async () => {
    try {
        const res = await pool.query('SELECT * FROM department');
        console.table(res.rows);
    } catch (err) {
        console.error('Not being able to find Departments', err);
    }
};

const viewRoles = async () => {
    try {
        const res = await pool.query(`
            SELECT role.id, role.title, role.salary, department.name AS department
            FROM role
            JOIN department ON role.department_id = department.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Not being able to find Roles:', err);
    }
};

const viewEmployees = async () => {
    try {
        const res = await pool.query(`
            SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title AS role, 
                department.name AS department, 
                role.salary, 
                COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'None') AS manager
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Not being able to find employees:', err);
    }
};

menu();

const addDepartment = async () => {
    try {
        const { departmentName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Please name it your new department:',
            },
        ]);

        await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
        console.log(`"${departmentName}" was added!`);
    } catch (err) {
        console.error('Unable to add Department:', err);
    }
};

const addRole = async () => {
    try {
        const departments = await pool.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(dept => ({
            name: dept.name,
            value: dept.id,
        }));

        const { roleTitle, roleSalary, departmentId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'Please name it your new role:',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'Please type the role salary:',
                validate: input => !isNaN(input) || 'Please add a valid number.',
            },
            {
                type: 'list',
                name: 'departmentId',
                message: 'Please select the department its enroled with:',
                choices: departmentChoices,
            },
        ]);

        await pool.query(
            'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
            [roleTitle, roleSalary, departmentId]
        );

        console.log(`"${roleTitle}" was added!`);
    } catch (err) {
        console.error('Unable to add Role:', err);
    }
};

const addEmployee = async () => {
    try {
        // Carregar cargos e departamentos do banco
        const roles = await pool.query(`
            SELECT role.id AS role_id, role.title AS role_title, department.name AS department_name
            FROM role
            JOIN department ON role.department_id = department.id
        `);

        const roleChoices = roles.rows.map(role => ({
            name: `${role.role_title} (Department: ${role.department_name})`,
            value: role.role_id,
        }));

        // Carregar funcionários existentes para gerentes
        const employees = await pool.query('SELECT * FROM employee');
        const managerChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        managerChoices.unshift({ name: 'None', value: null });

        // Perguntar dados do novo funcionário
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Add employee FIRST name:',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Add employee LAST name:',
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'Please select employee role:',
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Please select employee manager:',
                choices: managerChoices,
            },
        ]);

        await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, roleId, managerId]
        );

        console.log(`"${firstName} ${lastName}" was added!"`);
    } catch (err) {
        console.error('Unable to add employee:', err);
    }
};


const updateEmployeeRole = async () => {
    try {

        const employees = await pool.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));

        
        const roles = await pool.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id,
        }));

        
        const { employeeId, newRoleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Please select the employee you would like to update:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'newRoleId',
                message: 'Select employee new role:',
                choices: roleChoices,
            },
        ]);

    
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
            newRoleId,
            employeeId,
        ]);

        console.log(`"${employeeId}" Was successfully updated!`);
    } catch (err) {
        console.error('Unable to update the employee:', err);
    }
};
