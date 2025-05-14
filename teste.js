const sqlite = require('sqlite3')
const { open } = require('sqlite')

const db = new sqlite.Database('./teste.db');

async function conectar() {
    const db = await open({
        filename: './teste.db',
        driver: sqlite.Database
    })
    setup()
}

function setup () {
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT
        )
    `)
}

async function insertUser(query, valores) {
    try{
        await db.run(query, valores)
    } catch {
        console.log(err)
    }
}

module.exports = {conectar, insertUser}