import CompanyRepositoryInterface from '../../application/ports/CompanyRepositoryInterface.js';
import TransferRepositoryInterface from '../../application/ports/TransferRepositoryInterface.js';

/**
 * Use case to retrieve companies that performed transfers in the last month,
 * including their associated transfer details.
 *
 * @class GetCompaniesWithTransfersLastMonthUseCase
 */
export class GetCompaniesWithTransfersLastMonthUseCase {
  /**
   * Creates an instance of GetCompaniesWithTransfersLastMonthUseCase.
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
   * Retrieves companies that have performed transfers within the last month
   * and attaches their respective transfer details.
   *
   * @async
   * @function execute
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of company objects,
   * each including a "transfers" property with the associated transfers.
   */
  async execute() {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
    // Retrieve all transfers and filter those within the last month.
    const transfers = await this.transferRepository.findAll();
    const transfersLastMonth = transfers.filter(transfer => {
      const transferDate = new Date(transfer.createdAt);
      return transferDate >= startOfLastMonth && transferDate <= endOfLastMonth;
    });
  
    // Get unique company IDs from the filtered transfers.
    const companyIds = [...new Set(transfersLastMonth.map(t => t.companyId))];
  
    // Retrieve companies corresponding to the filtered IDs.
    const companies = await this.companyRepository.findByIds(companyIds);
  
    // Map each company to include its related transfers.
    const companiesWithTransfers = companies.map(company => {
      const companyTransfers = transfersLastMonth.filter(
        t => t.companyId === company.cuit
      );
      return { ...company, transfers: companyTransfers };
    });
  
    return companiesWithTransfers;
  }
}
