
const { query } = require('../config/db');

async function seedData() {
    try {
        console.log('Seeding data...');

        // Check if categories exist
        const cats = await query('SELECT * FROM Categories');
        if (cats.length === 0) {
            console.log('Inserting Categories...');
            await query(`INSERT INTO Categories (Name, OrderIndex) VALUES 
        ('Entrantes', 1),
        ('Principales', 2),
        ('Postres', 3),
        ('Bebidas', 4)
      `);
        } else {
            console.log('Categories already exist.');
        }

        // Check if products exist
        const prods = await query('SELECT * FROM Products');
        if (prods.length === 0) {
            console.log('Inserting Sample Products...');
            // Get Category IDs
            const catRows = await query('SELECT Id, Name FROM Categories');
            const entrantesId = catRows.find(c => c.Name === 'Entrantes').Id;
            const principalesId = catRows.find(c => c.Name === 'Principales').Id;

            await query(`INSERT INTO Products (Name, Description, Price, ImageUrl, CategoryId, IsActive) VALUES 
          ('Croquetas de Jamón', 'Deliciosas croquetas caseras.', 8.50, '', ${entrantesId}, 1),
          ('Hamburguesa Cabornera', 'Carne 100% vacuno con queso cheddar.', 12.00, '', ${principalesId}, 1)
        `);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedData();
