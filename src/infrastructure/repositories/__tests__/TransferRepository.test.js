/* eslint-disable no-undef */
/**
 * @fileoverview Unit tests for the TransferRepository.
 */

import TransferRepository from '../TransferRepository.js';

describe('TransferRepository', () => {
  let fakeClient;
  let transferRepository;

  beforeEach(() => {
    // Create a fake client with a mocked "query" method.
    fakeClient = {
      query: jest.fn()
    };
    transferRepository = new TransferRepository(fakeClient);
  });

  /**
   * Test that findAll returns transfers mapped to Transfer entities.
   */
  test('findAll should return transfers mapped to Transfer entities', async () => {
    const fakeRows = [
      {
        id: 1,
        amount: 1000,
        company_id: 'company1',
        debit_account: '001',
        credit_account: '002',
        created_at: '2025-03-15T00:00:00Z'
      },
      {
        id: 2,
        amount: 2000,
        company_id: 'company2',
        debit_account: '003',
        credit_account: '004',
        created_at: '2025-03-20T00:00:00Z'
      }
    ];
    // Simulate a successful query response.
    fakeClient.query.mockResolvedValue({ rows: fakeRows });
    const transfers = await transferRepository.findAll();

    expect(transfers).toHaveLength(2);
    expect(transfers[0]).toMatchObject({
      id: 1,
      amount: 1000,
      companyId: 'company1',
      debitAccount: '001',
      creditAccount: '002',
      createdAt: new Date('2025-03-15T00:00:00Z')
    });
    expect(fakeClient.query).toHaveBeenCalledWith('SELECT * FROM transfers');
  });

  /**
   * Test that save inserts a transfer and returns the created Transfer instance.
   */
  test('save should insert a transfer and return the created Transfer instance', async () => {
    const transferData = {
      amount: 1500,
      companyId: 'company1',
      debitAccount: '005',
      creditAccount: '006',
      createdAt: new Date('2025-04-01T00:00:00Z')
    };
    const fakeRow = {
      id: 3,
      amount: transferData.amount,
      company_id: transferData.companyId,
      debit_account: transferData.debitAccount,
      credit_account: transferData.creditAccount,
      created_at: transferData.createdAt.toISOString()
    };
    // Simulate a successful insertion query response.
    fakeClient.query.mockResolvedValue({ rows: [fakeRow] });
    const savedTransfer = await transferRepository.save(transferData);

    expect(savedTransfer).toMatchObject({
      id: 3,
      amount: transferData.amount,
      companyId: transferData.companyId,
      debitAccount: transferData.debitAccount,
      creditAccount: transferData.creditAccount,
      createdAt: new Date(fakeRow.created_at)
    });
    expect(fakeClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO transfers'),
      [transferData.amount, transferData.companyId, transferData.debitAccount, transferData.creditAccount, transferData.createdAt]
    );
  });
});
