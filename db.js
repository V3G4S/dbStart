const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function dbConnecion() {
    try {
        const db = await open({
            filename: 'banco.db',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )
        `);

        const user = await db.all('SELECT * FROM users');
        console.log(user);

        return db;
    } catch (err) {
        console.error(err);
    }
}

dbConnecion();

module.exports = { dbConnecion };