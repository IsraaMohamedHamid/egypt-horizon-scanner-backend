
////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
  
///////////////// PACKAGES /////////////////

// const jwt = require("jsonwebtoken");

// const multer = require("multer");
// const path = require("path");

// const fs = require("fs");
const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


const installPythonLibraries = () => {
  return new Promise((resolve, reject) => {
    const libraries = ['pandas', 'transformers', 'pymongo'];
    const commands = libraries.map(library => `pip3 install ${library} `).join(' && ');

    exec(commands, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing Python libraries: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(stderr);
        return;
      }
      console.log(`Python libraries installed successfully.`);
      resolve();
    });
  });
};

const startProcessing = async () => {
  try {
    console.log('Installing Python libraries...');
    await installPythonLibraries();
    console.log('Python libraries installed successfully.');
    // Now you can proceed with your other code
  } catch (error) {
    console.error('Error:', error);
  }
};

//////////////////////////////////////////// EXPORTS //////////////////////////////////////////////
module.exports = {
    startProcessing: startProcessing
};
