const express = require('express');
const { conectar, getDb } = require('./db');

const PORT = 8000;
const app = express();
app.use(express.json());

async function main() {
    await conectar();

    app.post('/users', async (req, res) => {
        const db = getDb();
        const { name, email } = req.body;
        try {
            const result = await db.run(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [name, email]
            );
            res.status(201).json({ id: result.lastID, name, email });
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                res.status(400).json({ error: 'Email já cadastrado' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });

    app.get('/users', async (req, res) => {
        const db = getDb();
        try {
            const users = await db.all('SELECT * FROM users');
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.get('/users/:id', async (req, res) => {
        const db = getDb();
        const { id } = req.params;
        try {
            const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.put('/users/:id', async (req, res) => {
        const db = getDb();
        const { id } = req.params;
        const { name, email } = req.body;
        try {
            const result = await db.run(
                'UPDATE users SET name = ?, email = ? WHERE id = ?',
                [name, email, id]
            );
            if (result.changes > 0) {
                res.status(200).json({ id, name, email });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                res.status(400).json({ error: 'Email já cadastrado' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });

    app.delete('/users/:id', async (req, res) => {
        const db = getDb();
        const { id } = req.params;
        try {
            const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
            if (result.changes > 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Usuário não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    app.listen(PORT, () => {
        console.log(`Servidor rodando em: http://localhost:${PORT}`);
    });
}

main();