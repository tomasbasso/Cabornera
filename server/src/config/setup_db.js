
const sql = require('msnodesqlv8');

const connectionString = "Driver={ODBC Driver 17 for SQL Server};Server=(local);Database=master;Trusted_Connection=yes;";

const query = (q) => new Promise((resolve, reject) => {
    sql.query(connectionString, q, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

async function createDatabase() {
    try {
        const dbName = 'CaborneraDB';
        console.log(`Checking if database ${dbName} exists...`);
        const result = await query(`SELECT name FROM sys.databases WHERE name = '${dbName}'`);

        if (result.length === 0) {
            console.log(`Creating database ${dbName}...`);
            await query(`CREATE DATABASE ${dbName}`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
    }
}

createDatabase();
