/* eslint-disable no-unused-vars */
/**
 * Interface for the Company Repository.
 * This abstract class defines the methods that any concrete Company Repository must implement.
 *
 * @abstract
 */
export default class CompanyRepositoryInterface {
    /**
     * Retrieves all companies.
     *
     * @async
     * @function findAll
     * @abstract
     * @returns {Promise<Array>} A promise that resolves to an array of company objects.
     * @throws {Error} If the method is not implemented.
     */
    async findAll() {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Retrieves companies by an array of IDs (CUITs).
     *
     * @async
     * @function findByIds
     * @abstract
     * @param {string[]} ids - An array of company IDs.
     * @returns {Promise<Array>} A promise that resolves to an array of company objects.
     * @throws {Error} If the method is not implemented.
     */
    async findByIds(ids) {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Retrieves a company by its CUIT.
     *
     * @async
     * @function findByCuit
     * @abstract
     * @param {string} cuit - The unique CUIT identifier of the company.
     * @returns {Promise<Object|null>} A promise that resolves to the company object, or null if not found.
     * @throws {Error} If the method is not implemented.
     */
    async findByCuit(cuit) {
      throw new Error('Method not implemented.');
    }
  
    /**
     * Saves a new company.
     *
     * @async
     * @function save
     * @abstract
     * @param {Object} companyData - The data of the company to be saved.
     * @param {string} companyData.cuit - The company's unique CUIT.
     * @param {string} companyData.name - The company's name.
     * @param {Date} companyData.joinedAt - The company's adhesion date.
     * @returns {Promise<Object>} A promise that resolves to the newly created company object.
     * @throws {Error} If the method is not implemented.
     */
    async save(companyData) {
      throw new Error('Method not implemented.');
    }
  }
  