/* eslint-disable no-unused-vars */
/**
 * Interface for the Transfer Repository.
 * This class serves as an abstract base for implementing transfer repository operations.
 *
 * @abstract
 */
export default class TransferRepositoryInterface {
    /**
     * Retrieves all transfer records.
     *
     * @async
     * @function findAll
     * @abstract
     * @returns {Promise<Array>} A promise that resolves to an array of transfer objects.
     * @throws {Error} If the method is not implemented.
     */
    async findAll() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Saves a new transfer record.
     *
     * @async
     * @function save
     * @abstract
     * @param {Object} transferData - The transfer data.
     * @param {number} transferData.amount - The transfer amount.
     * @param {string} transferData.companyId - The ID of the company making the transfer.
     * @param {string} transferData.debitAccount - The debit account number.
     * @param {string} transferData.creditAccount - The credit account number.
     * @param {Date} transferData.createdAt - The creation date of the transfer.
     * @returns {Promise<Object>} A promise that resolves to the saved transfer object.
     * @throws {Error} If the method is not implemented.
     */
    async save(transferData) {
      throw new Error('Method not implemented.');
    }
  }
  