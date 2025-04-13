require('dotenv').config();
const bcrypt = require('bcrypt');

// Create a set of default admin credentials for testing
// This will not be needed once deployed
const DEFAULT_ADMIN_USERNAME = process.env.DEFAULT_ADMIN_USERNAME;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;

/**
 * Sets up the authentication system
 * @param {Object} db - MySQL database connection
 */
const setupAuth = async (db) => {
    // Create a default admin user
    try {
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
        
        db.query(
        'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?);',
        [DEFAULT_ADMIN_USERNAME, hashedPassword, DEFAULT_ADMIN_EMAIL],
        (err) => {
            if (err) {
            console.error('Error creating default admin:', err);
            return;
            }
            console.log(`Default admin user created: ${DEFAULT_ADMIN_USERNAME} / ${DEFAULT_ADMIN_PASSWORD}`);
            console.log('WARNING: This is for development only. Change or remove in production.');
        }
        );
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

module.exports = {
  setupAuth,
};