import { GetCompaniesWithTransfersLastMonthUseCase } from "../../../domain/usecases/getCompaniesWithTransfersLastMonthUseCase.js";
import { GetCompaniesWithAdhesionLastMonthUseCase } from "../../../domain/usecases/getCompaniesWithAdhesionLastMonthUseCase.js";
import { AdhereCompanyUseCase } from "../../../domain/usecases/adhereCompanyUseCase.js";
import PostgreSQLAdapter from "../../../infrastructure/adapters/PostgreSQLAdapter.js";
import { CreateCompanyDTO } from "../../../domain/dtos/CreateCompanyDTO.js";

const adapter = new PostgreSQLAdapter();

const getTransfersUseCase = new GetCompaniesWithTransfersLastMonthUseCase({
  companyRepository: adapter.companyRepository,
  transferRepository: adapter.transferRepository,
});

const getAdhesionUseCase = new GetCompaniesWithAdhesionLastMonthUseCase({
  companyRepository: adapter.companyRepository,
  transferRepository: adapter.transferRepository,
});

const adhereCompanyUseCase = new AdhereCompanyUseCase({
  companyRepository: adapter.companyRepository,
});

/**
 * Company Controller module.
 * This module handles HTTP requests related to company operations.
 * @module CompanyController
 */
const CompanyController = {
  /**
   * Retrieves companies that have performed transfers in the last month.
   *
   * @async
   * @function getCompaniesWithTransfersLastMonth
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} JSON response containing an array of companies.
   */
  getCompaniesWithTransfersLastMonth: async (req, res) => {
    try {
      const companies = await getTransfersUseCase.execute();
      res.status(200).json(companies);
    } catch (error) {
      console.error("Error fetching companies with transfers last month:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Retrieves companies that joined (adhesion) in the last month.
   *
   * @async
   * @function getCompaniesWithAdhesionLastMonth
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} JSON response containing an array of companies.
   */
  getCompaniesWithAdhesionLastMonth: async (req, res) => {
    try {
      const companies = await getAdhesionUseCase.execute();
      res.status(200).json(companies);
    } catch (error) {
      console.error("Error fetching companies with adhesion last month:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Creates a new company.
   * Validates the input using CreateCompanyDTO before passing the data to the use case.
   *
   * @async
   * @function adhereCompany
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   * @returns {Promise<void>} JSON response containing the newly created company.
   * @throws {Error} Returns HTTP 400 if validation fails, otherwise HTTP 500.
   */
  adhereCompany: async (req, res) => {
    try {
      // Validate input data using the DTO
      const dto = new CreateCompanyDTO(req.body);
      const validatedData = dto.validate();

      const company = await adhereCompanyUseCase.execute(validatedData);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      const statusCode = error.message.toLowerCase().includes("validation") ? 400 : 500;
      res.status(statusCode).json({ error: error.message });
    }
  },
};

export default CompanyController;
