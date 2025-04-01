import pool from '../db/connection.js';
import CompanyRepository from '../repositories/CompanyRepository.js';
import TransferRepository from '../repositories/TransferRepository.js';

/**
 * PostgreSQLAdapter provides a centralized way to access the
 * company and transfer repositories using a shared PostgreSQL connection pool.
 *
 * @class PostgreSQLAdapter
 */
export default class PostgreSQLAdapter {
  /**
   * Creates an instance of PostgreSQLAdapter.
   * Initializes the repositories with the shared PostgreSQL client (pool).
   *
   * @constructor
   */
  constructor() {
    /**
     * The PostgreSQL client pool.
     * @type {import('pg').Pool}
     */
    this.client = pool;
    /**
     * The repository instance for managing companies.
     * @type {CompanyRepository}
     */
    this.companyRepository = new CompanyRepository(this.client);
    /**
     * The repository instance for managing transfers.
     * @type {TransferRepository}
     */
    this.transferRepository = new TransferRepository(this.client);
  }
}
