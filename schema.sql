CREATE database amazonDB;

USE amazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity DECIMAL(10,0) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,0) NULL,
  PRIMARY KEY (department_id)
);

SELECT * FROM products;

select * from departments;

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("spoon", "kitchen", 4, 165, 0), ("fork", "kitchen", 1, 69, 0), ("xbox", "electronics", 100, 4, 0), ("ps4", "electronics", 200, 15, 0), ("gameboy", "personal", 300, 25, 0)


INSERT INTO departments (department_name, over_head_costs)
VALUES ("kitchen", 1000), ("electronics", 2000), ("personal", 3000)