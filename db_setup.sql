DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
	("Macbook Pro", "Apple", 1200, 5),
	("Mountain Bike", "Scott", 1500, 150),
	("Road Bike", "Schwinn", 500, 100),
	("Dirt Bike", "Yamaha", 1500, 200),
	("Snowboard", "Never Summer", 750, 125),
	("Electric Guitar", "Fender", 1000, 500),
	("Acoustic Guitar", "Gretsch", 1500, 500),
	("Computer Monitor", "LG", 150, 10),
	("Coding Bootcamp Course", "UA Coding Bootcamp", 9500, 1),
	("Headphones", "Bose", 250, 30);


SELECT * FROM bamazon.products