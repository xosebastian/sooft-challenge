/**
 * Represents a company.
 * @class
 * @default
 */
export default class Company {
    /**
     * The company's unique CUIT identifier.
     * @type {string}
     */
    cuit = '';
  
    /**
     * The company's name.
     * @type {string}
     */
    name = '';
  
    /**
     * The company's adhesion date.
     * @type {Date}
     */
    joinedAt = new Date();
  
    /**
     * Create a new instance of the Company class.
     * @constructor
     * @param {object} params - The company parameters.
     * @param {string} params.cuit - The company's unique CUIT identifier.
     * @param {string} params.name - The company's name.
     * @param {Date} [params.joinedAt] - The company's adhesion date. Defaults to the current date if not provided.
     */
    constructor({ cuit, name, joinedAt }) {
      this.cuit = cuit;
      this.name = name;
      this.joinedAt = joinedAt || new Date();
    }
  }
  