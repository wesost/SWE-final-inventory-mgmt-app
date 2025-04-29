require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const util = require('util');

const app = express();

// Middleware
app.use(express.json());
app.use(require('cors')());

// Need to use Express session middleware for storing session data
// This includes storing whether the user has been authenticated
// Provides access to protected routes like admin dashboard
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 1 // 1 hour
  }
}));

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
    // For developer testing, create a fake user
    // This should be removed when actually deployed
    const { setupAuth } = require('./setupAuth');
    setupAuth(db);
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
    
    // Try get user from the database
    // Need to use promise-based approach for running queries in async functions
    const query = util.promisify(db.query).bind(db);
    const results = await query(
      'SELECT username, password_hash FROM users WHERE username = ?', 
      [username]
    );
    
    // Check if a user was found
    if (!results.length) {
      return res.status(401).json({
        success: false, 
        message: 'Invalid username or password'
      });
    }
    
    const user = results[0];
    
    // Verify the password using bcrypt (assuming bcrypt.compare returns a promise)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
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

app.get('/api/auth/verify', (req, res) => {
  // Check if user is authenticated
  if (req.session && req.session.user) {
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
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

// Edit a selected item from the inventory
app.put('/api/items/:id', (req, res) => {
  const fields = Object.entries(req.body).filter(([_, v]) => v !== undefined);             //Convert the request body into an array of [key, value] filter out any fields where the value is undefined (e.g., missing input)
  if (fields.length === 0) return res.status(400).json({ error: "No data to update." });   //If there are no valid fields to update

  const setClause = fields.map(([k]) => `${k} = ?`).join(', ');                            //Create the SQL SET clause "name = ?, quantity = ?, category = ?"
  const values = fields.map(([_, v]) => v).concat(req.params.id);                          //Extract the values from the fields array and append the item ID

  db.query(`UPDATE items SET ${setClause} WHERE item_id = ?`, values, (err) => {           //Run the SQL query to update the item 
    if (err) return res.status(500).json({ error: err.message });                          //If there's a DB error, return a 500 Internal Server
    res.json({ message: "Item updated successfully" });                                    //If the query succeeds, send back a success message
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});