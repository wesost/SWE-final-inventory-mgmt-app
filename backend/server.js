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
// ----------------------------------------------------------------------------------

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // For now, always validate the user
    // The actual login logic can be implemented after the rest of the components are connected up
    res.json({ success: true });
    return; // for debug #REMOVE
    
    // Get user from database
    const [rows] = await db.query(
      'SELECT username, password_hash FROM users WHERE username = ?', 
      [username]
    );
    
    const user = rows[0];
    
    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
    
    // Store user info in session (excluding password)
    req.session.user = {
      username: user.username,
      // Add other non-sensitive user info here
    };
    
    res.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Other routes
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