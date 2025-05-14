const express = require('express');
const { dbConnecion } = require('./db');

const PORT = 8000;
const app = express();
app.use(express.json());

const db = dbConnecion();

app.post('/users', async (req, res) => {
    const { name, email } = req.body;

    try {
        const result = await db.run(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        )
        res.status(201).json({ id: result.lastID, name, email });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});