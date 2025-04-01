/* eslint-disable no-undef */
import { GetCompaniesWithTransfersLastMonthUseCase } from '../getCompaniesWithTransfersLastMonthUseCase.js';
import CompanyRepositoryInterface from '../../../application/ports/CompanyRepositoryInterface.js';
import TransferRepositoryInterface from '../../../application/ports/TransferRepositoryInterface.js';

/**
 * Mock implementation of the CompanyRepositoryInterface for testing.
 *
 * @class MockCompanyRepository
 * @extends {CompanyRepositoryInterface}
 */
class MockCompanyRepository extends CompanyRepositoryInterface {
  /**
   * Creates an instance of MockCompanyRepository.
   *
   * @constructor
   * @param {Array<Object>} companies - An array of company objects.
   */
  constructor(companies) {
    super();
    this.companies = companies;
  }
  
  /**
   * Retrieves companies by their CUITs.
   *
   * @async
   * @param {string[]} ids - An array of company CUITs.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of companies.
   */
  async findByIds(ids) {
    return this.companies.filter(company => ids.includes(company.cuit));
  }
  
  /**
   * Dummy implementation of findAll (not used in this use case).
   *
   * @async
   * @returns {Promise<Array<Object>>} A promise that resolves to all companies.
   */
  async findAll() {
    return this.companies;
  }
  
  /**
   * Dummy implementation of findByCuit.
   *
   * @async
   * @param {string} cuit - The company's CUIT.
   * @returns {Promise<Object|null>} The company object or null.
   */
  async findByCuit(cuit) {
    return this.companies.find(company => company.cuit === cuit) || null;
  }
  
  /**
   * Dummy implementation of save.
   *
   * @async
   * @param {Object} companyData - The company data.
   * @returns {Promise<Object>} The saved company.
   */
  async save(companyData) {
    this.companies.push(companyData);
    return companyData;
  }
}

/**
 * Mock implementation of the TransferRepositoryInterface for testing.
 *
 * @class MockTransferRepository
 * @extends {TransferRepositoryInterface}
 */
class MockTransferRepository extends TransferRepositoryInterface {
  /**
   * Creates an instance of MockTransferRepository.
   *
   * @constructor
   * @param {Array<Object>} transfers - An array of transfer objects.
   */
  constructor(transfers) {
    super();
    this.transfers = transfers;
  }
  
  /**
   * Retrieves all transfers.
   *
   * @async
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of transfers.
   */
  async findAll() {
    return this.transfers;
  }
  
  /**
   * Dummy implementation of save.
   *
   * @async
   * @param {Object} transferData - The transfer data.
   * @returns {Promise<Object>} The saved transfer.
   */
  async save(transferData) {
    this.transfers.push(transferData);
    return transferData;
  }
}

describe('GetCompaniesWithTransfersLastMonthUseCase', () => {
  let mockCompanyRepo;
  let mockTransferRepo;
  let useCase;
  
  // Fix current time for deterministic date-based testing.
  beforeAll(() => {
    jest.useFakeTimers('modern');
    // Set current time to April 15, 2025; hence "last month" is March 2025.
    jest.setSystemTime(new Date('2025-04-15T00:00:00Z'));
  });
  
  afterAll(() => {
    jest.useRealTimers();
  });
  
  beforeEach(() => {
    // Sample companies.
    const companies = [
      { cuit: 'company1', name: 'Company One', joinedAt: new Date('2025-01-01T00:00:00Z') },
      { cuit: 'company2', name: 'Company Two', joinedAt: new Date('2025-02-01T00:00:00Z') },
      { cuit: 'company3', name: 'Company Three', joinedAt: new Date('2025-03-01T00:00:00Z') },
    ];
    
    // Sample transfers.
    // Only transfers with createdAt in March 2025 (between 2025-03-01 and 2025-03-31) should be considered.
    const transfers = [
      { id: 1, amount: 1000, companyId: 'company1', debitAccount: '001', creditAccount: '002', createdAt: new Date('2025-03-15T00:00:00Z') },
      { id: 2, amount: 2000, companyId: 'company2', debitAccount: '003', creditAccount: '004', createdAt: new Date('2025-03-20T00:00:00Z') },
      // Transfer outside last month: April transfer.
      { id: 3, amount: 1500, companyId: 'company1', debitAccount: '005', creditAccount: '006', createdAt: new Date('2025-04-01T00:00:00Z') },
      // Transfer outside last month: February transfer.
      { id: 4, amount: 2500, companyId: 'company3', debitAccount: '007', creditAccount: '008', createdAt: new Date('2025-02-28T00:00:00Z') },
    ];
    
    mockCompanyRepo = new MockCompanyRepository(companies);
    mockTransferRepo = new MockTransferRepository(transfers);
    
    useCase = new GetCompaniesWithTransfersLastMonthUseCase({
      companyRepository: mockCompanyRepo,
      transferRepository: mockTransferRepo,
    });
  });
  
  /**
   * Test: Should return only companies with transfers occurring in the last month.
   * In this test, only transfers with createdAt in March 2025 should be considered.
   */
  test('should return companies with transfers within the last month only', async () => {
    const result = await useCase.execute();
    
    // Expect companies that have transfers in March 2025.
    // company1 has two transfers, but only one in March (id 1), company2 has one transfer in March (id 2).
    // company3's transfer is in February, so it should not appear.
    expect(result).toHaveLength(2);
    
    const company1 = result.find(c => c.cuit === 'company1');
    const company2 = result.find(c => c.cuit === 'company2');
    
    expect(company1).toBeDefined();
    expect(company2).toBeDefined();
    
    // Company1 should only include transfer with id 1.
    expect(company1.transfers).toHaveLength(1);
    expect(company1.transfers[0].id).toBe(1);
    
    // Company2 should include transfer with id 2.
    expect(company2.transfers).toHaveLength(1);
    expect(company2.transfers[0].id).toBe(2);
  });
  
  /**
   * Test: Should return an empty array if no transfers occur in the last month.
   */
  test('should return an empty array if no transfers occur in the last month', async () => {
    // Modify transfers so none fall within the last month.
    mockTransferRepo.transfers = [
      { id: 5, amount: 3000, companyId: 'company1', debitAccount: '009', creditAccount: '010', createdAt: new Date('2025-04-05T00:00:00Z') },
    ];
    
    const result = await useCase.execute();
    expect(result).toHaveLength(0);
  });
});
