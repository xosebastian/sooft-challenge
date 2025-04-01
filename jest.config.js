/* eslint-disable no-undef */
module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "application/ports/"
      ],      
  };
  