/* eslint-disable no-undef */
import { GetCompaniesWithAdhesionLastMonthUseCase } from '../getCompaniesWithAdhesionLastMonthUseCase.js';
import CompanyRepositoryInterface from '../../../application/ports/CompanyRepositoryInterface.js';
import TransferRepositoryInterface from '../../../application/ports/TransferRepositoryInterface.js';

/**
 * Mock implementation of the CompanyRepositoryInterface for testing.
 *
 * @class MockCompanyRepository
 * @extends {CompanyRepositoryInterface}
 */
class MockCompanyRepository extends CompanyRepositoryInterface {
  constructor(companies = []) {
    super();
    /** @type {Array<Object>} */
    this.companies = companies;
  }
  
  /** @override */
  async findAll() {
    return this.companies;
  }
  
  /** @override */
  async findByIds(ids) {
    return this.companies.filter(company => ids.includes(company.cuit));
  }
  
  /** @override */
  async findByCuit(cuit) {
    return this.companies.find(company => company.cuit === cuit) || null;
  }
  
  /** Dummy implementation for save */
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
  constructor(transfers = []) {
    super();
    /** @type {Array<Object>} */
    this.transfers = transfers;
  }
  
  /** @override */
  async findAll() {
    return this.transfers;
  }
  
  /** Dummy implementation for save */
  async save(transferData) {
    this.transfers.push(transferData);
    return transferData;
  }
}

describe('GetCompaniesWithAdhesionLastMonthUseCase', () => {
  let mockCompanyRepo;
  let mockTransferRepo;
  let useCase;
  
  // Fix current time to control date-based tests.
  beforeAll(() => {
    jest.useFakeTimers('modern');
    // Set system time to April 15, 2025 so that "last month" is March 2025.
    jest.setSystemTime(new Date('2025-04-15T00:00:00Z'));
  });
  
  afterAll(() => {
    jest.useRealTimers();
  });
  
  beforeEach(() => {
    // Prepare sample companies and transfers.
    // For this test, assume "last month" is March 2025.
    const companies = [
      { cuit: '20-12345678-9', name: 'Company One', joinedAt: new Date('2025-03-10T00:00:00Z') },
      { cuit: '27-87654321-0', name: 'Company Two', joinedAt: new Date('2025-02-20T00:00:00Z') },
      { cuit: '30-98765432-1', name: 'Company Three', joinedAt: new Date('2025-03-25T00:00:00Z') },
    ];
    // Transfers: Company One and Company Three have transfers in March; one transfer is outside the range.
    const transfers = [
      { id: 1, amount: 1000, companyId: '20-12345678-9', debitAccount: '001', creditAccount: '002', createdAt: new Date('2025-03-15T00:00:00Z') },
      { id: 2, amount: 1500, companyId: '30-98765432-1', debitAccount: '003', creditAccount: '004', createdAt: new Date('2025-03-20T00:00:00Z') },
      // This transfer is outside the last month range (April transfer)
      { id: 3, amount: 2000, companyId: '20-12345678-9', debitAccount: '005', creditAccount: '006', createdAt: new Date('2025-04-01T00:00:00Z') },
    ];
    
    mockCompanyRepo = new MockCompanyRepository(companies);
    mockTransferRepo = new MockTransferRepository(transfers);
    
    useCase = new GetCompaniesWithAdhesionLastMonthUseCase({
      companyRepository: mockCompanyRepo,
      transferRepository: mockTransferRepo,
    });
  });
  
  /**
   * Test: Should return only companies that joined last month along with their transfers.
   */
  test('should return companies that joined last month with their transfers', async () => {
    const result = await useCase.execute();
    
    // Expect only Company One and Company Three to be returned.
    expect(result).toHaveLength(2);
    
    const companyOne = result.find(company => company.cuit === '20-12345678-9');
    const companyThree = result.find(company => company.cuit === '30-98765432-1');
    
    expect(companyOne).toBeDefined();
    expect(companyThree).toBeDefined();
    
    // Verify that Company One only has transfers within March.
    expect(companyOne.transfers).toHaveLength(1);
    expect(companyOne.transfers[0].companyId).toBe('20-12345678-9');
    
    // Verify that Company Three has 1 transfer.
    expect(companyThree.transfers).toHaveLength(1);
    expect(companyThree.transfers[0].companyId).toBe('30-98765432-1');
  });
  
  /**
   * Test: Should return an empty array if no company joined last month.
   */
  test('should return an empty array if no companies joined last month', async () => {
    // Overwrite companies with those that joined outside of March.
    mockCompanyRepo.companies = [
      { cuit: '40-11111111-1', name: 'Company Four', joinedAt: new Date('2025-02-10T00:00:00Z') },
    ];
    
    const result = await useCase.execute();
    expect(result).toHaveLength(0);
  });
});
