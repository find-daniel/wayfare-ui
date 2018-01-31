const fs = require('fs');
const _ = require('lodash');

const envVariables = require('../config/.env.sample');

// writes in each .env file
const writeENVFile = (directory, variables) => {
  _.each(variables, (variable) => {
    // will add environment variables to the appropriate .env file
    fs.appendFileSync(`./${directory}/.env`, variable + '\n');
  })
}

// creates all the .env files
const buildEnv = () => {
  // for each key/value pair (server / environment variables)
  _.each(envVariables, (value, key) => {
    // creates .env file in the appropriate folders (based on keys) (replaces file if it already exists)
    fs.writeFileSync(`./${key}/.env`, '')
    // see above for writeENVFile
    writeENVFile(key, value);
  });
}

buildEnv();
