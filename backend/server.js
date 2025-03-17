require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(require('cors')());

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// API Routes. Basic queries for testing
app.get('/api/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/transactions', (req, res) => {
    const { item_id, transaction_type, quantity } = req.body;
    db.query(
        'INSERT INTO transactions (item_id, transaction_type, quantity) VALUES (?, ?, ?)',
        [item_id, transaction_type, quantity],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Transaction added successfully', id: results.insertId });
        }
    );
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
