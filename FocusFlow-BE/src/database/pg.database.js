require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Add event handler for connection errors
pool.on('error', (err,client) => {
    console.error('Unexpected error on idle client', err);
    // Don't crash the server, but log the error
});

// Fungsi untuk menghubungkan ke database
const connect = async () => {
    try {
        await pool.connect();
        console.log("✅ Connected to PostgreSQL (Neon Database)");
    } catch (error) {
        console.error("❌ Error connecting to PostgreSQL:", error.message);
    }
};

connect();

// Fungsi untuk menjalankan query
const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error("❌ Error executing query:", error.message);
        // Propagate the error instead of silently failing
        throw error;
    }
};

module.exports = {
    query,
    pool, // Export the pool for direct use if needed
};
