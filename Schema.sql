-- library_db_schema.sql
-- Script complet pour créer la base library_db avec support des éditions multiples

-- Supprimer la base si elle existe
DROP DATABASE IF EXISTS library_db;
CREATE DATABASE library_db;
USE library_db;

-- Table Authors
CREATE TABLE Author (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE
);

-- Table Books (concept de livre)
CREATE TABLE Book (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    genre VARCHAR(100),
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES Author(id)
);

-- Table CoffeeShops
CREATE TABLE CoffeeShop (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255)
);

-- Table Editions (une édition = une copie dans un coffee shop)
CREATE TABLE Edition (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    coffee_shop_id INT NOT NULL,
    publication_year YEAR,
    isbn VARCHAR(50),
    format VARCHAR(50),        -- Pocket, Folio, Hardcover, etc.
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (book_id) REFERENCES Book(id),
    FOREIGN KEY (coffee_shop_id) REFERENCES CoffeeShop(id)
);

-- Table Users (clients)
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    email VARCHAR(100) UNIQUE
);

-- Table Loans (emprunts sur une édition spécifique)
CREATE TABLE Loan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    edition_id INT NOT NULL,
    user_id INT NOT NULL,
    loan_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (edition_id) REFERENCES Edition(id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);
