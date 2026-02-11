const sql = require('mssql');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from server root (two levels up from src/config)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // For Somee
        trustServerCertificate: true
    }
};

let poolPromise = null;

const getConnection = async () => {
    try {
        if (!poolPromise) {
            poolPromise = sql.connect(config);
        }
        const pool = await poolPromise;
        console.log('Connected to SQL Server (CaborneraDB) via mssql');
        return pool;
    } catch (err) {
        console.error('SQL Connection Error: ', err);
        poolPromise = null; // Reset promise on error so we can retry
        throw err;
    }
};

const query = async (sqlQuery, params = []) => {
    try {
        const pool = await getConnection();
        const request = pool.request();

        // Handle parameters if provided (simple implementation)
        // Note: For complex parameterized queries, the calling code might need adjustment
        // This keeps compatibility with simple string queries

        const result = await request.query(sqlQuery);
        return result.recordset;
    } catch (err) {
        throw err;
    }
};

module.exports = { getConnection, query, sql };
