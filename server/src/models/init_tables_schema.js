
const { query } = require('../config/db');

async function createTablesSchema() {
    try {
        console.log('Creating Tables & Reservations schema...');

        // Tables Table
        // X, Y coordinates for the interactive map
        // Shape: 'rect' | 'circle'
        await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RestaurantTables' AND xtype='U')
      CREATE TABLE RestaurantTables (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(50) NOT NULL, 
        Capacity INT NOT NULL,
        PosX INT DEFAULT 0,
        PosY INT DEFAULT 0,
        Shape NVARCHAR(20) DEFAULT 'rect', 
        IsOccupied BIT DEFAULT 0
      )
    `);
        console.log('Table RestaurantTables created/verified.');

        // Reservations Table
        await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reservations' AND xtype='U')
      CREATE TABLE Reservations (
        Id INT PRIMARY KEY IDENTITY(1,1),
        CustomerName NVARCHAR(100) NOT NULL,
        CustomerPhone NVARCHAR(20),
        ReservationDate DATETIME NOT NULL,
        Pax INT NOT NULL,
        TableId INT FOREIGN KEY REFERENCES RestaurantTables(Id),
        Status NVARCHAR(20) DEFAULT 'Confirmed' -- Confirmed, Cancelled, Completed
      )
    `);
        console.log('Table Reservations created/verified.');

        // Seed some tables if empty
        const tables = await query('SELECT * FROM RestaurantTables');
        if (tables.length === 0) {
            console.log('Seeding initial tables...');
            await query(`
            INSERT INTO RestaurantTables (Name, Capacity, PosX, PosY, Shape) VALUES
            ('Mesa 1', 4, 100, 100, 'rect'),
            ('Mesa 2', 2, 300, 100, 'circle'),
            ('Mesa 3', 6, 100, 300, 'rect'),
            ('Mesa 4', 4, 300, 300, 'rect')
        `);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error creating schema:', err);
        process.exit(1);
    }
}

createTablesSchema();
