INSERT INTO department (name) VALUES 
('Sales'), 
('Engineering'), 
('Finance');

INSERT INTO role (title, salary, department_id) VALUES 
('Salesperson', 50000, 1),
('Engineer', 80000, 2),
('Accountant', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Johnson', 3, 1);
