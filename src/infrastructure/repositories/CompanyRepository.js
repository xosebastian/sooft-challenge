import CompanyRepositoryInterface from '../../application/ports/CompanyRepositoryInterface.js';
import Company from '../../domain/entities/Company.js';

/**
 * Repository for managing companies in PostgreSQL.
 * Implements the CompanyRepositoryInterface.
 *
 * @class CompanyRepository
 * @extends {CompanyRepositoryInterface}
 */
export default class CompanyRepository extends CompanyRepositoryInterface {
  /**
   * Creates an instance of CompanyRepository.
   *
   * @constructor
   * @param {object} client - A PostgreSQL client instance (from pg Pool or Client).
   */
  constructor(client) {
    super();
    this.client = client;
  }

  /**
   * Retrieves all companies from the database.
   *
   * @async
   * @function findAll
   * @returns {Promise<Company[]>} A promise that resolves to an array of Company instances.
   */
  async findAll() {
    const result = await this.client.query('SELECT * FROM companies');
    return result.rows.map(row => new Company({
      cuit: row.cuit,
      name: row.name,
      joinedAt: new Date(row.joined_at),
    }));
  }

  /**
   * Retrieves companies by an array of CUITs.
   *
   * @async
   * @function findByIds
   * @param {string[]} ids - An array of CUIT identifiers.
   * @returns {Promise<Company[]>} A promise that resolves to an array of Company instances.
   */
  async findByIds(ids) {
    if (ids.length === 0) return [];
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const query = `SELECT * FROM companies WHERE cuit IN (${placeholders})`;
    const result = await this.client.query(query, ids);
    return result.rows.map(row => new Company({
      cuit: row.cuit,
      name: row.name,
      joinedAt: new Date(row.joined_at),
    }));
  }

  /**
   * Retrieves a company by its CUIT.
   *
   * @async
   * @function findByCuit
   * @param {string} cuit - The unique CUIT identifier of the company.
   * @returns {Promise<Company|null>} A promise that resolves to a Company instance or null if not found.
   */
  async findByCuit(cuit) {
    const result = await this.client.query('SELECT * FROM companies WHERE cuit = $1', [cuit]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Company({
      cuit: row.cuit,
      name: row.name,
      joinedAt: new Date(row.joined_at),
    });
  }

  /**
   * Saves a new company to the database.
   *
   * @async
   * @function save
   * @param {object} companyData - An object containing company data.
   * @param {string} companyData.cuit - The company's unique CUIT identifier.
   * @param {string} companyData.name - The company's name.
   * @param {Date} companyData.joinedAt - The company's adhesion date.
   * @returns {Promise<Company>} A promise that resolves to the newly created Company instance.
   */
  async save(companyData) {
    const { cuit, name, joinedAt } = companyData;
    const query = 'INSERT INTO companies (cuit, name, joined_at) VALUES ($1, $2, $3) RETURNING *';
    const result = await this.client.query(query, [cuit, name, joinedAt]);
    const row = result.rows[0];
    return new Company({
      cuit: row.cuit,
      name: row.name,
      joinedAt: new Date(row.joined_at),
    });
  }
}
