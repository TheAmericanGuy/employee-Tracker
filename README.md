# Employee Tracker

## 📋 Description

**Employee Tracker** is a command-line application designed to help manage employee data efficiently. Built with **Node.js**, **Inquirer**, and **PostgreSQL**, this application allows business owners to view and manage departments, roles, and employees within their organization. It provides an intuitive CLI interface to perform CRUD operations.

---

## 🎯 Features

- **View Departments**: List all departments with their IDs.
- **View Roles**: Display all job roles with titles, salaries, and their respective departments.
- **View Employees**: Show all employees, including their roles, departments, salaries, and managers.
- **Add Entries**:
  - Add new departments.
  - Add roles and associate them with departments.
  - Add employees and assign their roles and managers.
- **Update Employee Roles**: Modify the role of any employee.
- **Data Association**: Ensure roles and departments are linked properly, with managers assigned to employees.

---

## 🛠️ Technologies Used

- **Node.js**: Server-side runtime for building the CLI.
- **Inquirer**: Provides an interactive command-line interface for user input.
- **PostgreSQL**: Relational database for storing and querying data.
- **Console.Table**: Formats and displays data in a table-like structure in the terminal.

---

## 📦 Installation

### 1. Clone the Repository
- ```bash
- git clone <repository-url>
- cd employee-tracker

### 2. Install Dependecies
- use "npm install" to install your dependencies

### 3. Set Up the Database
- Create the database by opening the terminal and creating the PostgreSQL database (CREATE DATABASE employee-tracker;);
- Run schema and seed by executing the following command: 
    psql -U <your-username> -d employee_tracker -f db/schema.sql
    psql -U <your-username> -d employee_tracker -f db/seeds.sql

### 4. Configure Enviroment Variables
- By creating a .env file, input your information from Postgres

## 🚀 Usage
- Start the application by using (node src/index.js)
- Use the interactive menu and follow its guides;

## 🗄️ Usage
The database structure includes three tables:

- **Department**: 
    id: Primary Key
    name: Name of the department

- **Role**: 
    id: Primary Key
    title: Title of the role
    salary: Salary for the role
    department_id: Foreign key referencing the department

- **Employee**: 
    id: Primary Key
    first_name: First Name of the employee
    last_name: Last Name of the employee
    role_id: Foreign key referencing the role
    manager_id: Foreign key referencing another employee as the manager

## 📸 Preview

Here is a video explaining the usage: 

## 🚧 Future Enhancements
- Add the ability to delete departments, roles, and employees.
- Implement views for employees by department and by manager
- Display the total budget utilized by each department.
- Add a web-based interface for broader accessibility.

## 🤝 Contributing
Contributions are welcome! Follow these steps to contribute:
- Fork the repository
- Create a feature branch (git checkout -b feature/your-feature).
- Commit your changes (git commit -m "Add your feature").
- Push to the branch (git push origin feature/your-feature).
- Open a pull request.

## 📜 License
This project is licensed under the MIT License.