/* eslint-disable no-undef */
/**
 * @fileoverview Unit tests for the CompanyRepository.
 */

import CompanyRepository from '../CompanyRepository.js';

describe('CompanyRepository', () => {
  let fakeClient;
  let companyRepository;

  beforeEach(() => {
    // Create a fake client with a mocked query method.
    fakeClient = {
      query: jest.fn()
    };
    companyRepository = new CompanyRepository(fakeClient);
  });

  /**
   * Test that findAll returns companies mapped to Company entities.
   */
  test('findAll should return companies mapped to Company entities', async () => {
    const fakeRows = [
      { cuit: '20-12345678-9', name: 'Company One', joined_at: '2025-03-25T00:00:00Z' },
      { cuit: '27-87654321-0', name: 'Company Two', joined_at: '2025-02-25T00:00:00Z' }
    ];
    fakeClient.query.mockResolvedValue({ rows: fakeRows });

    const companies = await companyRepository.findAll();

    expect(companies).toHaveLength(2);
    expect(companies[0]).toMatchObject({
      cuit: '20-12345678-9',
      name: 'Company One',
      joinedAt: new Date('2025-03-25T00:00:00Z')
    });
    expect(fakeClient.query).toHaveBeenCalledWith('SELECT * FROM companies');
  });

  /**
   * Test that findByIds returns only companies with the given CUITs.
   */
  test('findByIds should return only companies with the given CUITs', async () => {
    // Simulate a query response returning only the matching company.
    const fakeRows = [
      { cuit: '20-12345678-9', name: 'Company One', joined_at: '2025-03-25T00:00:00Z' }
    ];
    fakeClient.query.mockResolvedValue({ rows: fakeRows });

    const companies = await companyRepository.findByIds(['20-12345678-9']);
    expect(companies).toHaveLength(1);
    expect(companies[0].cuit).toBe('20-12345678-9');
  });

  /**
   * Test that findByCuit returns the correct company or null if not found.
   */
  test('findByCuit should return the correct company or null if not found', async () => {
    const fakeRow = { cuit: '20-12345678-9', name: 'Company One', joined_at: '2025-03-25T00:00:00Z' };
    fakeClient.query.mockResolvedValue({ rows: [fakeRow] });
    
    const company = await companyRepository.findByCuit('20-12345678-9');
    expect(company).toMatchObject({
      cuit: '20-12345678-9',
      name: 'Company One',
      joinedAt: new Date('2025-03-25T00:00:00Z')
    });
    
    // Simulate no company found.
    fakeClient.query.mockResolvedValue({ rows: [] });
    const noCompany = await companyRepository.findByCuit('nonexistent');
    expect(noCompany).toBeNull();
  });

  /**
   * Test that save inserts a company and returns the newly created Company instance.
   */
  test('save should insert a company and return it', async () => {
    const companyData = {
      cuit: '40-12345678-9',
      name: 'New Company',
      joinedAt: new Date('2025-04-01T00:00:00Z')
    };
    const fakeRow = {
      cuit: companyData.cuit,
      name: companyData.name,
      joined_at: companyData.joinedAt.toISOString()
    };
    fakeClient.query.mockResolvedValue({ rows: [fakeRow] });
    
    const savedCompany = await companyRepository.save(companyData);
    expect(savedCompany).toMatchObject({
      cuit: companyData.cuit,
      name: companyData.name,
      joinedAt: companyData.joinedAt
    });
    expect(fakeClient.query).toHaveBeenCalledWith(
      'INSERT INTO companies (cuit, name, joined_at) VALUES ($1, $2, $3) RETURNING *',
      [companyData.cuit, companyData.name, companyData.joinedAt]
    );
  });
});
