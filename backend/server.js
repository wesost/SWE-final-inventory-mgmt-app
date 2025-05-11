require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const util = require('util');
const app = express();
const axios = require('axios'); // for making external API calls

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

// call this before trying to make an api call for every item scanned
// takes upc returns bool
async function checkIfItemEntryPresentInDB (upc) {
  const query = util.promisify(db.query).bind(db);
  const sql = 'SELECT COUNT(*) as count FROM items WHERE barcode = ?';
  try {
    const results = await query(sql, upc);
    if (results && results.length > 0) {
      const count = results[0].count;
      console.log(`Database check for UPC ${upc}: Found ${count}`);
      if (count > 0){
        return true;
      }
      return false;
    }
    return false;
  } catch (error){
    console.error(`Database error looking up upc: ${upc}`, error);
    throw error; // caling function handles db error
  }
}

async function incrementItemQuantity(upc, res) { // res 
  if (!upc){
    throw new Error("No upc passed to increment function");
  }
  const query = util.promisify(db.query).bind(db);
  const sql = 'UPDATE items SET quantity = quantity + 1 WHERE barcode = ?';
  const resSql = 'SELECT * FROM items WHERE barcode = ?';
  console.log(`Attempting to increment count of item with upc: ${upc}`);
  try{
    const results = await query(sql, [upc]);
    if (results && results.affectedRows > 0){
      console.log(`Successfully incremented quantity for upc ${upc}`);
      const [product] = await query(resSql, [upc]); // get rows from table for product
      
      await logTransaction(product.item_id, 'IN', 1); // log transaction to db

      res.json({ // returns title and category to frontend
        message: 'Incremented item, sending item data to frontend', 
        title: product.name || 'no title',
        category: product.category || 'no category',
      });
      // return product;
      // return true;
    }
    else{
      console.log(`Item with upc: ${upc} not found, quantity not incremented...this should not happen`);
      // return false;
    }
  } catch (error) {
      console.error(`Database error while incrementing quantity for barcode ${upc}:`, error);
      throw error; // re throw so calling function knows something went wrong
  }
}

async function decrementItemQuantity(upc, res) { // res
  if (!upc){
    throw new Error("No upc passed to decrement function");
  }
  const query = util.promisify(db.query).bind(db);
  const sql = 'UPDATE items SET quantity = quantity - 1 WHERE barcode = ? AND quantity > 0';
  const resSql = 'SELECT * FROM items WHERE barcode = ?';
  console.log(`Attempting to decrement count of item with upc: ${upc}`);
  try{
    const results = await query(sql, [upc]);
    if (results && results.affectedRows > 0){
      console.log(`Successfully decremented quantity for upc ${upc}`);
      const [product] = await query(resSql, [upc]);
      await logTransaction(product.item_id, 'OUT', 1);

      res.json({
        message: 'Decremented item, sending item data to frontend',
        title: product.name || 'no title',
        category: product.category || 'no category',
      });
    } else {
      console.log(`Item with upc: ${upc} not decremented — quantity is likely already 0`);
      res.status(400).json({ message: 'Item cannot be decremented. Quantity already at 0.' });
    }
  } catch (error) {
      console.error(`Database error while decrementing quantity for barcode ${upc}:`, error);
      throw error; // re throw so calling function knows something went wrong
  }
}


function insertItemToDB (item, res) {
  db.query(
    'INSERT INTO items (name, category, quantity, net_weight, barcode, location_purchased) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
    [item.name,
      item.category,
      item.quantity,
      item.net_weight,
      item.barcode,
      item.location_purchased
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting/updating item data to database:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: 'Item added successfully', 
        affectedRows: results.affectedRows,
        title: item.name || 'no title'
      });
    }
  )
}
/////////////////////
// docker-compose up --build docker-compose down 
// upc lookup route - calls api 
// takes the upc to lookup via req and returns json data about the item via res
// app.post('/api/upc-lookup', async (req, res) => {}
  app.post('/api/upc-lookup', async (req, res) => {
    const { upc, mode = 'IN' } = req.body; // default mode is 'IN'
  
    if (!upc) {
      return res.status(400).json({ error: "UPC code is required" });
    }
  
    try {
      console.log(`Received lookup request for UPC: ${upc} with mode: ${mode}`);
  
      const itemExists = await checkIfItemEntryPresentInDB(upc);
  
      if (itemExists) {
        if (mode === 'OUT') {
          await decrementItemQuantity(upc, res);
          console.log('Item quantity decremented.');
        } else if (mode === 'IN') {
          await incrementItemQuantity(upc, res);
          console.log('Item quantity incremented.');
        } else {
          return res.status(400).json({ error: "Invalid mode. Must be either 'IN' or 'OUT'" });
        }
      } else {
        if (mode === 'OUT') {
          // Do not try to add item on scan-out
          console.log(`Item with UPC ${upc} not found. Cannot decrement.`);
          return res.status(404).json({ message: "Item not found in inventory." });
        }
  
        // For scan-in, try to fetch product data and insert into DB
        const response = await axios.post(
          'https://api.upcitemdb.com/prod/trial/lookup',
          { upc },
          { headers: { "Content-Type": "application/json" } }
        );
  
        console.log('API response status:', response.status);
  
        if (response.data && response.data.items && response.data.items.length > 0) {
          const foundItemData = response.data.items[0];
  
          const newItemToStore = {
            name: foundItemData.title || 'no title',
            category: foundItemData.category || 'uncategorized',
            quantity: 1,
            net_weight: 10, // hardcoded value
            barcode: foundItemData.upc || foundItemData.ean || upc,
            location_purchased: 'Spokane',
          };
  
          insertItemToDB(newItemToStore, res);
        } else {
          console.log(`No item found for UPC ${upc} by external API.`);
          return res.status(404).json({ message: "No product found for provided UPC. Please enter details manually." });
        }
      }
    } catch (error) {
      console.error("Error handling UPC lookup:", error.response ? error.response.data : error.message);
      return res.status(500).json({ error: "Server error during UPC lookup." });
    }
  });  

async function logTransaction(ItemID, type, quantity =1){
  const query = util.promisify(db.query).bind(db);
  const sql = 'INSERT INTO transactions (item_id, transaction_type, quantity) VALUES (?, ?, ?)';
  try {
    await query(sql, [ItemID, type, quantity]);
    console.log(`Transaction logged: ${type} ${quantity} of item ID ${ItemID}`);
  } catch (error) {
    console.error('Error logging transaction:', error.message);
  }
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});