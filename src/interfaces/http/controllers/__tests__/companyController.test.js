/* eslint-disable no-undef */

// Mock the use case modules and DTO so the controller runs in isolation.
jest.mock("../../../../domain/usecases/getCompaniesWithTransfersLastMonthUseCase.js", () => {
    return {
      GetCompaniesWithTransfersLastMonthUseCase: jest.fn().mockImplementation(() => {
        return {
          execute: jest.fn().mockResolvedValue([
            { cuit: "company1", name: "Company One", transfers: [] }
          ])
        };
      })
    };
  });
  
  jest.mock("../../../../domain/usecases/getCompaniesWithAdhesionLastMonthUseCase.js", () => {
    return {
      GetCompaniesWithAdhesionLastMonthUseCase: jest.fn().mockImplementation(() => {
        return {
          execute: jest.fn().mockResolvedValue([
            { cuit: "company2", name: "Company Two", transfers: [] }
          ])
        };
      })
    };
  });
  
  jest.mock("../../../../domain/usecases/adhereCompanyUseCase.js", () => {
    return {
      AdhereCompanyUseCase: jest.fn().mockImplementation(() => {
        return {
          execute: jest.fn().mockResolvedValue({
            cuit: "company3",
            name: "Company Three",
            joinedAt: "2025-03-25T00:00:00Z"
          })
        };
      })
    };
  });
  
  jest.mock("../../../../domain/dtos/CreateCompanyDTO.js", () => {
    return {
      CreateCompanyDTO: jest.fn().mockImplementation((data) => {
        return {
          validate: jest.fn().mockReturnValue(data)
        };
      })
    };
  });
  
  import CompanyController from "../../controllers/companyController.js";
  
  describe("CompanyController", () => {
    let req, res;
    
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
    
    test("getCompaniesWithTransfersLastMonth returns companies with status 200", async () => {
      await CompanyController.getCompaniesWithTransfersLastMonth(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { cuit: "company1", name: "Company One", transfers: [] }
      ]);
    });
    
    test("getCompaniesWithAdhesionLastMonth returns companies with status 200", async () => {
      await CompanyController.getCompaniesWithAdhesionLastMonth(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { cuit: "company2", name: "Company Two", transfers: [] }
      ]);
    });
    
    test("adhereCompany creates a new company with status 201", async () => {
      req.body = { cuit: "company3", name: "Company Three", joinedAt: "2025-03-25T00:00:00Z" };
      await CompanyController.adhereCompany(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        cuit: "company3",
        name: "Company Three",
        joinedAt: "2025-03-25T00:00:00Z"
      });
    });
    
    test("adhereCompany returns 400 on validation error", async () => {
      // Override the DTO to simulate a validation error.
      const { CreateCompanyDTO } = require("../../../../domain/dtos/CreateCompanyDTO.js");
      CreateCompanyDTO.mockImplementation(() => {
        return {
          validate: () => { throw new Error("Validation error: missing field"); }
        };
      });
      
      req.body = {}; // Missing required fields.
      await CompanyController.adhereCompany(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error: missing field" });
    });
  });
  