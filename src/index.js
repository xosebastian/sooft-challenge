/* eslint-disable no-undef */
/**
 * @module App
 * @description Initializes and configures the Express application.
 */

import express from 'express';
import routes from './interfaces/http/routes.js';

/**
 * The Express application instance.
 * @type {import('express').Application}
 */
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Mount the API routes under the "/api" prefix
app.use('/api', routes);

/**
 * The port on which the server will listen.
 * @type {number|string}
 */
const PORT = process.env.PORT || 3000;

/**
 * Starts the server.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
