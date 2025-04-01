/* eslint-disable no-undef */
import { AdhereCompanyUseCase } from '../adhereCompanyUseCase.js';
import CompanyRepositoryInterface from '../../../application/ports/CompanyRepositoryInterface.js';

/**
 * Mock implementation of the CompanyRepositoryInterface for testing.
 *
 * @class MockCompanyRepository
 * @extends {CompanyRepositoryInterface}
 */
class MockCompanyRepository extends CompanyRepositoryInterface {
  constructor() {
    super();
    /** @type {Array<Object>} */
    this.companies = [];
  }
  
  /**
   * Finds a company by its CUIT.
   *
   * @param {string} cuit - The company's CUIT.
   * @returns {Promise<Object|null>} A promise that resolves to the company object or null if not found.
   */
  async findByCuit(cuit) {
    return this.companies.find(company => company.cuit === cuit) || null;
  }
  
  /**
   * Saves a new company to the repository.
   *
   * @param {Object} companyData - The data for the new company.
   * @returns {Promise<Object>} A promise that resolves to the saved company object.
   */
  async save(companyData) {
    this.companies.push(companyData);
    return companyData;
  }
  
  // For completeness, dummy implementations for other methods could be added.
  async findAll() {
    return this.companies;
  }
  
  async findByIds(ids) {
    return this.companies.filter(company => ids.includes(company.cuit));
  }
}

describe('AdhereCompanyUseCase', () => {
  let mockCompanyRepository;
  let adhereCompanyUseCase;
  
  beforeEach(() => {
    mockCompanyRepository = new MockCompanyRepository();
    adhereCompanyUseCase = new AdhereCompanyUseCase({ companyRepository: mockCompanyRepository });
  });
  
  /**
   * Test: Creating a new company should succeed if it does not already exist.
   */
  test('should create a new company if it does not exist', async () => {
    const companyData = {
      cuit: '40-12345678-9',
      name: 'Test Company',
      joinedAt: new Date('2025-03-25T00:00:00Z'),
    };
    
    const result = await adhereCompanyUseCase.execute(companyData);
    expect(result).toEqual(companyData);
    expect(mockCompanyRepository.companies).toHaveLength(1);
  });
  
  /**
   * Test: Creating a company that already exists should throw an error.
   */
  test('should throw an error if the company already exists', async () => {
    const companyData = {
      cuit: '40-12345678-9',
      name: 'Test Company',
      joinedAt: new Date('2025-03-25T00:00:00Z'),
    };
    
    // First, create the company successfully.
    await adhereCompanyUseCase.execute(companyData);
    
    // Then, attempting to create the same company again should throw an error.
    await expect(adhereCompanyUseCase.execute(companyData))
      .rejects
      .toThrow('The company is already adhered');
  });
});
