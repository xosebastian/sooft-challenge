/**
 * @module Routes
 * @description Defines API endpoints for company operations.
 */

import { Router } from 'express';
import companyController from './controllers/companyController.js';

const router = Router();

/**
 * GET /companies/transfers
 * Retrieves companies that performed transfers in the last month.
 *
 * @name GetCompaniesWithTransfersLastMonth
 * @function
 * @memberof module:Routes
 * @param {import("express").Request} req - The express request object.
 * @param {import("express").Response} res - The express response object.
 */
router.get('/companies/transfers', companyController.getCompaniesWithTransfersLastMonth);

/**
 * GET /companies/adhesions
 * Retrieves companies that joined last month.
 *
 * @name GetCompaniesWithAdhesionLastMonth
 * @function
 * @memberof module:Routes
 * @param {import("express").Request} req - The express request object.
 * @param {import("express").Response} res - The express response object.
 */
router.get('/companies/adhesions', companyController.getCompaniesWithAdhesionLastMonth);

/**
 * POST /companies/adhere
 * Creates a new company.
 *
 * @name AdhereCompany
 * @function
 * @memberof module:Routes
 * @param {import("express").Request} req - The express request object.
 * @param {import("express").Response} res - The express response object.
 */
router.post('/companies/adhere', companyController.adhereCompany);

export default router;
