import Joi from "joi";

/**
 * Data Transfer Object for creating a company.
 * Validates the input data using Joi.
 *
 * @class CreateCompanyDTO
 */
export class CreateCompanyDTO {
  /**
   * Creates an instance of CreateCompanyDTO.
   *
   * @constructor
   * @param {Object} data - The input data for the company.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Validates the company data.
   * 
   * @function validate
   * @returns {Object} The validated data.
   * @throws {Error} Throws an error with detailed messages if validation fails.
   */
  validate() {
    const schema = Joi.object({
      cuit: Joi.string().required().messages({
        "string.base": "CUIT must be a string",
        "any.required": "CUIT is required",
      }),
      name: Joi.string().required().messages({
        "string.base": "Company name must be a string",
        "any.required": "Company name is required",
      }),
      joinedAt: Joi.date().required().messages({
        "date.base": "Joined date must be a valid date",
        "any.required": "Joined date is required",
      }),
    });

    const { error, value } = schema.validate(this.data, { abortEarly: false });
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((x) => x.message).join(", ")}`
      );
    }
    return value;
  }
}
