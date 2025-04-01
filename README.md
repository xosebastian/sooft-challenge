# Sooft Challenge

This project is a Node.js challenge that demonstrates a **Hexagonal Architecture** using Express, PostgreSQL, Babel, Jest for testing, ESLint for linting, and Docker for containerization. The project includes use cases, DTOs for input validation, repository interfaces with concrete PostgreSQL implementations, and a set of RESTful endpoints.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [Linting](#linting)
- [Testing](#testing)
- [Usage](#usage)
- [Notes](#notes)

## Project Structure


```
project/
├── docker-compose.yml         # Docker Compose configuration (includes PostgreSQL)
├── Dockerfile                 # Dockerfile for the Node.js application
├── package.json
├── babel.config.json
├── jest.config.js             # Jest configuration file (CommonJS format)
├── .nvmrc                   # Specifies Node.js version (e.g., 18.16.0 LTS)
├── db.sql                   # SQL script for database initialization
└── src/
    ├── index.js                 # Main entry point for the Express app
    ├── domain/
    │   ├── entities/          # Domain entities (Company, Transfer)
    │   ├── dtos/              # Data Transfer Objects (e.g., CreateCompanyDTO)
    │   └── usecases/          # Business logic use cases (adhereCompany, getCompaniesWithTransfersLastMonth, etc.)
    ├── application/
    │   └── ports/             # Repository interfaces (CompanyRepositoryInterface, TransferRepositoryInterface)
    ├── infrastructure/
    │   ├── db/                # Database connection configuration
    │   ├── repositories/      # Concrete repository implementations (CompanyRepository, TransferRepository)
    │   └── adapters/          # Adapters (e.g., PostgreSQLAdapter)
    └── interfaces/
        └── http/              # HTTP layer (Express routes and controllers)
            ├── controllers/
            │   └── companyController.js
            └── routes.js
```

## Features

- **Hexagonal Architecture:**  
  The project is organized in layers, separating the domain, application (ports), and infrastructure (adapters, repositories).

- **RESTful Endpoints:**  
  Endpoints for retrieving companies based on transfers and adhesion dates, and for creating new companies with input validation via DTOs.

- **PostgreSQL Integration:**  
  Uses PostgreSQL as the persistence layer. Data initialization is managed by a `seed.sql` file via Docker Compose.

- **Unit Testing with Jest:**  
  Includes comprehensive unit tests for use cases and repositories.

- **ESLint & Prettier:**  
  Configured to maintain a consistent code style.

## Requirements

- [Node.js](https://nodejs.org/) (Recommended LTS version as specified in `.nvmrc`, e.g., 18.16.0)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/xosebastian/sooft-challenge
   cd sooft-challenge
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory if you need to override default environment variables. For example:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=challenge_db
DB_PORT=5432
PORT=3000
```

## Running the Application

You can start the application locally with:

```bash
npm start
```

The server will run on the port specified in your environment variables (default: 3000).

## Docker Setup

To run the application with Docker and PostgreSQL:

1. Ensure your `db.sql` file is in the same directory as your `docker-compose.yml` and contains the necessary SQL statements to initialize your database.

2. Start the containers:

   ```bash
   docker-compose up --build
   ```

3. If you make changes to the seed data and want to reinitialize the database, bring down the containers with volumes removed:

   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

## Linting

ESLint is configured to ensure code quality. To run ESLint:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

## Testing

The project uses Jest for unit testing. To run tests with coverage:

```bash
npm test
```

Jest configuration is provided in `jest.config.js` (using CommonJS syntax).

## Usage

The following endpoints are available:

- **GET /api/companies/transfers**  
  Retrieves companies that performed transfers in the last month (with their transfer details).

- **GET /api/companies/adhesions**  
  Retrieves companies that joined in the last month (with their associated transfers if applicable).

- **POST /api/companies/adhere**  
  Creates a new company.  
  **Request Body Example:**

  ```json
  {
    "cuit": "40-12345678-9",
    "name": "New Company",
    "joinedAt": "2025-03-25T00:00:00.000Z"
  }
  ```

## Notes

- **DTO Validation:**  
  Input validation for company creation is handled using a DTO (`CreateCompanyDTO`) and Joi. If validation fails, the endpoint responds with HTTP 400 and a detailed error message.

- **Repository Interfaces:**  
  The project uses abstract repository interfaces to decouple business logic from database implementation details.

- **Testing & Mocks:**  
  Unit tests use mocked repositories to isolate the business logic from the actual database operations.

- **Coverage Exclusions:**  
  Files within `application/ports` can be excluded from coverage via `coveragePathIgnorePatterns` in the Jest configuration.