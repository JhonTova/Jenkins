const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('./database/config');

const app = express();
app.use(express.json());

let connection;

async function initDB() {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado a MySQL');
}

app.post('/api/data', async (req, res) => {
    try {
        const { name, value } = req.body;
        if (!name || !value) {
            return res.status(400).json({ error: 'Name and value are required' });
        }

        const [result] = await connection.execute(
            'INSERT INTO records (name, value) VALUES (?, ?)',
            [name, value]
        );

        res.status(201).json({ id: result.insertId, name, value });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM records');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error al iniciar la base de datos:', err);
    process.exit(1);
});