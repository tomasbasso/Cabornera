
const { query } = require('../config/db');

// --- Tables ---
const getTables = async (req, res) => {
    try {
        const result = await query('SELECT * FROM RestaurantTables');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTablePosition = async (req, res) => {
    const { id } = req.params;
    const { x, y } = req.body;
    try {
        await query(`UPDATE RestaurantTables SET PosX = ${x}, PosY = ${y} WHERE Id = ${id}`);
        res.json({ message: 'Table moved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleTableStatus = async (req, res) => {
    const { id } = req.params;
    const { IsOccupied } = req.body; // true/false
    try {
        await query(`UPDATE RestaurantTables SET IsOccupied = ${IsOccupied ? 1 : 0} WHERE Id = ${id}`);
        res.json({ message: 'Table status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// --- Reservations ---
const getReservations = async (req, res) => {
    try {
        const q = `
            SELECT 
                r.Id, r.CustomerName, r.CustomerPhone, r.Pax, r.Status, r.TableId,
                CONVERT(VARCHAR(19), r.ReservationDate, 120) as ReservationDate,
                t.Name as TableName
            FROM Reservations r
            LEFT JOIN RestaurantTables t ON r.TableId = t.Id
            ORDER BY r.ReservationDate DESC
        `;
        const rows = await query(q);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createReservation = async (req, res) => {
    const { CustomerName, CustomerPhone, ReservationDate, Pax, TableId } = req.body;

    // Handle optional TableId
    const safeTableId = TableId ? TableId : 'NULL';
    const safePax = Pax ? parseInt(Pax) : 0;

    // Fix Date Format: Ensure we store exactly what the user sent
    // The frontend sends 'YYYY-MM-DDTHH:mm', we just replace T with space for SQL
    const safeDate = ReservationDate.replace('T', ' ') + ':00';

    try {
        // Validation: Check if table is already booked around that time (e.g., +/- 1.5 hours)
        if (safeTableId !== 'NULL') {
            const conflictQuery = `
                SELECT COUNT(*) as count 
                FROM Reservations 
                WHERE TableId = ${safeTableId} 
                AND Status = 'Confirmed'
                AND ReservationDate >= DATEADD(minute, -90, '${safeDate}')
                AND ReservationDate <= DATEADD(minute, 90, '${safeDate}')
            `;
            const conflictResult = await query(conflictQuery);
            if (conflictResult[0].count > 0) {
                return res.status(409).json({ error: 'La mesa ya está reservada en un horario cercano (±1h 30m).' });
            }
        }

        const q = `
            INSERT INTO Reservations (CustomerName, CustomerPhone, ReservationDate, Pax, TableId, Status)
            VALUES ('${CustomerName}', '${CustomerPhone}', '${safeDate}', ${safePax}, ${safeTableId}, 'Confirmed')
        `;
        console.log('Executing:', q);

        await query(q);
        res.status(201).json({ message: 'Reservation created' });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateReservationStatus = async (req, res) => {
    const { id } = req.params;
    const { Status } = req.body; // 'Confirmed', 'Cancelled', 'Completed'
    try {
        await query(`UPDATE Reservations SET Status = '${Status}' WHERE Id = ${id}`);
        res.json({ message: 'Reservation status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTables,
    updateTablePosition,
    toggleTableStatus,
    getReservations,
    createReservation,
    updateReservationStatus
};
