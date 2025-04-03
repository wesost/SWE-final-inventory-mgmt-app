require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();

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
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database');
});

// API Routes
// Fetch all items from the inventory
app.get('/api/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Add a new item to the inventory
app.post('/api/items', (req, res) => {
    const { name, category, quantity, net_weight, barcode, location_purchased } = req.body;

    db.query(
        'INSERT INTO items (name, category, quantity, net_weight, barcode, location_purchased) VALUES (?, ?, ?, ?, ?, ?)',
        [name, category, quantity, net_weight, barcode, location_purchased],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Item added successfully', id: results.insertId });
        }
    );
});

// Delete an item from the inventory
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM items WHERE item_id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Item deleted successfully' });
    });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});