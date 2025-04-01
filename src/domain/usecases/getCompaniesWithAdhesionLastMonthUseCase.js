import CompanyRepositoryInterface from '../../application/ports/CompanyRepositoryInterface.js';
import TransferRepositoryInterface from '../../application/ports/TransferRepositoryInterface.js';

/**
 * Use case to retrieve companies that joined last month along with their transfers (only transfers within the last month).
 *
 * @class GetCompaniesWithAdhesionLastMonthUseCase
 */
export class GetCompaniesWithAdhesionLastMonthUseCase {
  /**
   * Creates an instance of GetCompaniesWithAdhesionLastMonthUseCase.
   *
   * @constructor
   * @param {Object} dependencies - The required dependencies.
   * @param {CompanyRepositoryInterface} dependencies.companyRepository - The company repository.
   * @param {TransferRepositoryInterface} dependencies.transferRepository - The transfer repository.
   * @throws {Error} If any dependency is invalid.
   */
  constructor({ companyRepository, transferRepository }) {
    if (!(companyRepository instanceof CompanyRepositoryInterface)) {
      throw new Error('Invalid companyRepository');
    }
    if (!(transferRepository instanceof TransferRepositoryInterface)) {
      throw new Error('Invalid transferRepository');
    }
    this.companyRepository = companyRepository;
    this.transferRepository = transferRepository;
  }
  
  /**
   * Executes the use case.
   * Retrieves companies that joined last month and attaches only the transfers that occurred during that period.
   *
   * @async
   * @function execute
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of company objects, each including a "transfers" property with the related transfers.
   */
  async execute() {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Retrieve all companies.
    const companies = await this.companyRepository.findAll();
    
    // Filter companies that joined last month.
    const filteredCompanies = companies.filter(company => {
      const joinedDate = new Date(company.joinedAt);
      return joinedDate >= startOfLastMonth && joinedDate <= endOfLastMonth;
    });
    
    // Retrieve all transfers.
    const transfers = await this.transferRepository.findAll();
    
    // Filter transfers that occurred in the last month.
    const transfersLastMonth = transfers.filter(t => {
      const transferDate = new Date(t.createdAt);
      return transferDate >= startOfLastMonth && transferDate <= endOfLastMonth;
    });
    
    // Attach filtered transfer details to each filtered company.
    const companiesWithTransfers = filteredCompanies.map(company => {
      const companyTransfers = transfersLastMonth.filter(t => t.companyId === company.cuit);
      return { ...company, transfers: companyTransfers };
    });
    
    return companiesWithTransfers;
  }
}
