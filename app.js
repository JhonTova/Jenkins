const express = require('express');
const mysql = require('mysql2/promise');
const dbConfig = require('./database/config');

const app = express();
app.use(express.json());

// Crear conexión a la base de datos
let connection;

async function initDB() {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado a MySQL');
}

// Endpoint para crear un registro
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

// Endpoint para obtener todos los registros
app.get('/api/data', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM records');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error al iniciar la base de datos:', err);
    process.exit(1);
});