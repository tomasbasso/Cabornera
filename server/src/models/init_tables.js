
const { query } = require('../config/db');

async function createTables() {
    try {
        console.log('Creating tables...');

        // Categories Table
        await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Categories' AND xtype='U')
      CREATE TABLE Categories (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        OrderIndex INT DEFAULT 0
      )
    `);
        console.log('Table Categories created/verified.');

        // Products Table
        await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' AND xtype='U')
      CREATE TABLE Products (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX),
        Price DECIMAL(10, 2) NOT NULL,
        ImageUrl NVARCHAR(MAX),
        CategoryId INT FOREIGN KEY REFERENCES Categories(Id),
        IsActive BIT DEFAULT 1,
        OrderIndex INT DEFAULT 0
      )
    `);
        console.log('Table Products created/verified.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

createTables();
