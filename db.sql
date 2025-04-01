-- seed.sql

-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS companies;

-- Create the companies table
CREATE TABLE companies (
    cuit VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP NOT NULL
);

-- Create the transfers table
CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    amount NUMERIC(10,2) NOT NULL,
    company_id VARCHAR(20) NOT NULL,
    debit_account VARCHAR(50) NOT NULL,
    credit_account VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_company
      FOREIGN KEY(company_id) 
      REFERENCES companies(cuit)
);

-- Insert sample data into companies
INSERT INTO companies (cuit, name, joined_at) VALUES
('20-12345678-9', 'Empresa Uno', '2025-02-15'),
('27-87654321-0', 'Empresa Dos', '2025-03-05'),
('30-98765432-1', 'Empresa Tres', '2025-03-20');

-- Insert sample data into transfers
INSERT INTO transfers (amount, company_id, debit_account, credit_account, created_at) VALUES
(1000.00, '20-12345678-9', '001', '002', '2025-02-20'),
(2000.00, '27-87654321-0', '003', '004', '2025-03-10'),
(1500.00, '20-12345678-9', '005', '006', '2025-03-15'),
(1800.00, '30-98765432-1', '007', '008', '2025-03-18');
