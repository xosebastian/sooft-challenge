/* eslint-disable no-undef */
import { Pool } from 'pg';

/**
 * PostgreSQL connection pool configuration.
 *
 * This pool uses environment variables with fallback defaults.
 * In production, you may want to add additional options such as SSL.
 *
 * @constant {Pool}
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'challenge_db',
  // Optional: Enable SSL in production environments
  // ssl: { rejectUnauthorized: false },
});

export default pool;
