import TransferRepositoryInterface from '../../application/ports/TransferRepositoryInterface.js';
import Transfer from '../../domain/entities/Transfer.js';

/**
 * Repository for managing transfers in PostgreSQL.
 * Implements the TransferRepositoryInterface.
 *
 * @class TransferRepository
 * @extends {TransferRepositoryInterface}
 */
export default class TransferRepository extends TransferRepositoryInterface {
  /**
   * Creates an instance of TransferRepository.
   *
   * @constructor
   * @param {object} client - A PostgreSQL client instance (e.g., from pg Pool or Client).
   */
  constructor(client) {
    super();
    this.client = client;
  }
  
  /**
   * Retrieves all transfers from the database.
   *
   * @async
   * @function findAll
   * @returns {Promise<Transfer[]>} A promise that resolves to an array of Transfer instances.
   */
  async findAll() {
    const result = await this.client.query('SELECT * FROM transfers');
    return result.rows.map(row => new Transfer({
      id: row.id,
      amount: row.amount,
      companyId: row.company_id,
      debitAccount: row.debit_account,
      creditAccount: row.credit_account,
      createdAt: new Date(row.created_at),
    }));
  }
  
  /**
   * Saves a new transfer to the database.
   *
   * @async
   * @function save
   * @param {object} transferData - An object containing transfer data.
   * @param {number} transferData.amount - The transfer amount.
   * @param {string} transferData.companyId - The ID of the company making the transfer.
   * @param {string} transferData.debitAccount - The debit account number.
   * @param {string} transferData.creditAccount - The credit account number.
   * @param {Date} transferData.createdAt - The creation date of the transfer.
   * @returns {Promise<Transfer>} A promise that resolves to the newly created Transfer instance.
   */
  async save(transferData) {
    const { amount, companyId, debitAccount, creditAccount, createdAt } = transferData;
    const query = `
      INSERT INTO transfers (amount, company_id, debit_account, credit_account, created_at)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await this.client.query(query, [amount, companyId, debitAccount, creditAccount, createdAt]);
    return new Transfer({
      id: result.rows[0].id,
      amount: result.rows[0].amount,
      companyId: result.rows[0].company_id,
      debitAccount: result.rows[0].debit_account,
      creditAccount: result.rows[0].credit_account,
      createdAt: new Date(result.rows[0].created_at),
    });
  }
}
