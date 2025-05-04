module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  
  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>/src"],
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"],
  
  // The test environment that will be used for testing
  testEnvironment: "node",
  
  // A map from regular expressions to paths to transformers
  transform: {},
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Setup files that will run before each test
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  
  // Time in milliseconds after which a test is considered slow
  slowTestThreshold: 5000,
  
  // Stop running tests after `n` failures
  bail: 0,

  // If test has env or global variable dependency, specify here
  testEnvironmentOptions: {
    NODE_ENV: "test"
  }
};