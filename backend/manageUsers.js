require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER,                
  password: process.env.DB_PASS,            
  database: process.env.DB_NAME,            
});

// Retrieve command-line arguments excluding 'node' and script filename
const args = process.argv.slice(2);

// Destructure the first argument as the main command (e.g., 'add', 'delete')
// and collect the rest of the arguments into an array
const [command, ...rest] = args;

/**
 * Parses an array of command-line options in the form of:
 * ["--key1", "value1", "--key2", "value2", ...]
 * and returns an object: { key1: "value1", key2: "value2", ... }
 */
const parseArgs = (argArray) => {
  const argObj = {};
  argArray.forEach((arg, i) => {
    if (
      arg.startsWith('--') &&                      // Is a named flag
      argArray[i + 1] &&                           // Has a next value
      !argArray[i + 1].startsWith('--')            // Next value is not another flag
    ) {
      argObj[arg.slice(2)] = argArray[i + 1];      // Strip '--' and store in object
    }
  });
  return argObj;
};

// Parse the rest of the arguments into a key-value object
const options = parseArgs(rest);

// Wrap the command handling logic in an immediately-invoked async function
(async () => {
  if (command === 'add') {
    // Check if admin flag is present
    const isAdmin = rest.includes('--admin');

    // Extract fields
    const { username, password, email } = options;

    if (!username || !password) {
      console.error('Missing required fields: --username, --password');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToUse = email || null;
    const role = isAdmin ? 'admin' : 'staff';

    db.query(
      `
      INSERT INTO users (username, password_hash, email, role)
      VALUES (?, ?, ?, ?)
      `,
      [username, hashedPassword, emailToUse, role],
      (err, results) => {
        if (err) {
          console.error('Error creating or updating user:', err.message);
          process.exit(1);
        }

        if (results.affectedRows === 1) {
          console.log(`User '${username}' created successfully.`);
        }

        process.exit(0);
      }
    );

  } else if (command === 'delete') {
    const { username } = options;

    if (!username) {
      console.error('Missing required field: --username');
      process.exit(1);
    }

    db.query(
      'DELETE FROM users WHERE username = ?;',
      [username],
      (err, results) => {
        if (err) {
          console.error('Error deleting user:', err.message);
          process.exit(1);
        }

        if (results.affectedRows === 0) {
          console.log(`User '${username}' not found.`);
        } else {
          console.log(`User '${username}' deleted successfully.`);
        }
        process.exit(0);
      }
    );

  } else if (command === 'list') {
    db.query(
      'SELECT username, email, role FROM users;',
      (err, results) => {
        if (err) {
          console.error('Error fetching users:', err.message);
          process.exit(1);
        }

        if (results.length === 0) {
          console.log('No users found.');
        } else {
          console.table(results);
        }
        process.exit(0);
      }
    );

  } else {
    console.log('Usage:');
    console.log('  manage-users.sh add --username USER --password PASS [--email EMAIL] [--admin]');
    console.log('  manage-users.sh delete --username USER');
    console.log('  manage-users.sh list');
    process.exit(1);
  }
})();