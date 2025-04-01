/**
 * Represents a financial transfer.
 * @class
 * @default
 */
export default class Transfer {
    /**
     * The transfer amount.
     * @type {number}
     */
    amount = 0;
    
    /**
     * The ID of the company making the transfer.
     * @type {string}
     */
    companyId = '';
    
    /**
     * The debit account number.
     * @type {string}
     */
    debitAccount = '';
    
    /**
     * The credit account number.
     * @type {string}
     */
    creditAccount = '';
    
    /**
     * The date and time when the transfer was created.
     * @type {Date}
     */
    createdAt = new Date();
    
    /**
     * Create a new instance of the Transfer class.
     * @constructor
     * @param {object} params - The transfer parameters.
     * @param {number} params.amount - The transfer amount.
     * @param {string} params.companyId - The ID of the company making the transfer.
     * @param {string} params.debitAccount - The debit account number.
     * @param {string} params.creditAccount - The credit account number.
     * @param {Date} [params.createdAt] - The creation date of the transfer.
     * @param {number} [params.id] - The transfer ID.
     */
    constructor({ id, amount, companyId, debitAccount, creditAccount, createdAt }) {
      this.id = id;
      this.amount = amount;
      this.companyId = companyId;
      this.debitAccount = debitAccount;
      this.creditAccount = creditAccount;
      this.createdAt = createdAt || new Date();
    }
  }
  