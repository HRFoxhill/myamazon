
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE user (
  user_id INTEGER NOT NULL AUTO_INCREMENT,
 
  `username` VARCHAR(30) NOT NULL,

  `first_name` VARCHAR(30) NOT NULL,

  `last_name` VARCHAR(30) NOT NULL,

  street_address VARCHAR(30) NOT NULL,

  city VARCHAR(30) NOT NULL,

  state VARCHAR(30) NOT NULL,

  zipcode INTEGER(10) NOT NULL,

  email VARCHAR(30) NOT NULL,
 
  `password` VARCHAR (30) NOT NULL,
  
  PRIMARY KEY (user_id)
);

CREATE TABLE products (
  id INTEGER NOT NULL AUTO_INCREMENT,
 
  `name` VARCHAR (30) NOT NULL,

  quantity INTEGER(11) NOT NULL,
  
  price DECIMAL (10,2) DEFAULT 1.00,

  total_price DECIMAL (10,2) DEFAULT 1.00,
  
  
  PRIMARY KEY (id)

);

INSERT INTO products ( `name`, quantity, price) VALUES ('Cat Food', 3, 26.49);
INSERT INTO products ( `name`, quantity, price) VALUES ('Dog Food', 5, 31.52);
INSERT INTO products ( `name`, quantity, price) VALUES ('Fish Food', 30, 7.89);
INSERT INTO products ( `name`, quantity, price) VALUES ('Speakers', 2, 189.97);
INSERT INTO products ( `name`, quantity, price) VALUES ('TV', 7, 249.97);
INSERT INTO products ( `name`, quantity, price) VALUES ('4K DVD Player', 2, 67.89);
INSERT INTO products ( `name`, quantity, price) VALUES ('Nintendo Switch', 8, 299.99);
INSERT INTO products ( `name`, quantity, price) VALUES ('PS4', 11, 349.99);
INSERT INTO products ( `name`, quantity, price) VALUES ('XBOX One', 3, 199.99);

CREATE TABLE cart (
  id INTEGER NOT NULL AUTO_INCREMENT,
  
  cart_id INTEGER NOT NULL,
 
  `name` VARCHAR (30) NOT NULL,

  quantity INTEGER(11) NOT NULL,
  
  price DECIMAL (10,2) DEFAULT 1.00,

  subtotal DECIMAL (10,2) DEFAULT 1.00,
  
  checkout_price DECIMAL (10,2) DEFAULT 0.00,
  
  PRIMARY KEY (id)

);

SELECT * FROM user;
SELECT * FROM products;
SELECT * FROM cart;
SELECT * FROM products WHERE `name`='XBOX One';
SELECT user_id FROM user INNER JOIN cart ON user.user_id = cart.cart_id;
SELECT * FROM cart WHERE cart_id = 2;
UPDATE cart SET checkout_price = SUM(total_price) FROM cart WHERE cart_id = 1 GROUP BY cart.id;
          