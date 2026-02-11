
const { query } = require('../config/db');

async function seedExtended() {
    try {
        console.log('Seeding extended tables...');

        // Clear existing tables for a clean slate (optional, but good for "resetting" layout)
        // await query('DELETE FROM Reservations');
        // await query('DELETE FROM RestaurantTables');

        // Check count
        const result = await query('SELECT count(*) as count FROM RestaurantTables');
        const count = result[0].count;

        if (count < 5) {
            console.log('Adding more tables...');
            await query(`
            INSERT INTO RestaurantTables (Name, Capacity, PosX, PosY, Shape, IsOccupied) VALUES
            ('Mesa 5', 4, 500, 100, 'rect', 0),
            ('Mesa 6', 8, 300, 500, 'rect', 1),
            ('Barra 1', 1, 600, 300, 'circle', 0),
            ('Barra 2', 1, 600, 400, 'circle', 1),
            ('Mesa VIP', 10, 100, 500, 'rect', 0)
        `);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
}

seedExtended();
