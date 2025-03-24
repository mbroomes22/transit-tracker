const fs = require('fs');
const path = require('path');

// Function to read a secret from a file and set it as an environment variable
const setEnvVarFromFile = (envVarName, filePath) => {
  try {
    const secret = fs.readFileSync(filePath, 'utf8').trim();
    process.env[envVarName] = secret;
    console.log(`Set ${envVarName} from ${filePath}`);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
};

// Set environment variables from secrets files
setEnvVarFromFile('REACT_APP_GEOPS_API_KEY', '/etc/secrets/REACT_APP_GEOPS_API_KEY');
setEnvVarFromFile('MOBILITY_DATABASE_API_KEY', '/etc/secrets/MOBILITY_DATABASE_API_KEY');

// Start the React application
require('react-scripts/scripts/start');
