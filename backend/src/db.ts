const { Pool } = require("pg");

const dotenv = require("dotenv");

dotenv.config();

if (!process.env.LINK) {
  throw new Error("Database connection string is not defined in the environment variables.");
}

const pool = new Pool({
  connectionString: process.env.LINK,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { pool };
