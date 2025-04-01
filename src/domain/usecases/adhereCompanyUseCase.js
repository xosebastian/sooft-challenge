import CompanyRepositoryInterface from '../../application/ports/CompanyRepositoryInterface.js';

/**
 * Use case for adhering (creating) a new company.
 *
 * @class AdhereCompanyUseCase
 */
export class AdhereCompanyUseCase {
  /**
   * Creates an instance of AdhereCompanyUseCase.
   *
   * @constructor
   * @param {Object} dependencies - The required dependencies.
   * @param {CompanyRepositoryInterface} dependencies.companyRepository - The repository for company operations.
   * @throws {Error} If the provided companyRepository does not implement the required interface.
   */
  constructor({ companyRepository }) {
    if (!(companyRepository instanceof CompanyRepositoryInterface)) {
      throw new Error('Invalid companyRepository');
    }
    this.companyRepository = companyRepository;
  }
  
  /**
   * Executes the use case.
   * Checks if a company with the provided CUIT already exists.
   * If not, it saves the new company and returns it.
   *
   * @async
   * @function execute
   * @param {Object} companyData - The data for the new company.
   * @param {string} companyData.cuit - The company's unique CUIT identifier.
   * @param {string} companyData.name - The company's name.
   * @param {Date} companyData.joinedAt - The company's adhesion date.
   * @returns {Promise<Object>} A promise that resolves to the newly created company object.
   * @throws {Error} If the company already exists.
   */
  async execute(companyData) {
    // Check if the company already exists based on its CUIT.
    const existing = await this.companyRepository.findByCuit(companyData.cuit);
    if (existing) {
      throw new Error('The company is already adhered');
    }
    
    // Save and return the new company.
    const newCompany = await this.companyRepository.save(companyData);
    return newCompany;
  }
}
