
////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
const {
    EmergenceIssueOfTheMonthModel,
    EmergenceIssueOfTheMonthSchema
  } from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model.js');
  
  const {
    EmergenceIssueOfTheMonthDataModel,
    EmergenceIssueOfTheMonthDataSchema
  } from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model.js');
  

  

///////////////// PACKAGES /////////////////

// const jwt from "jsonwebtoken");

// const multer from "multer");
// const path from "path");

// const fs from "fs");
const { spawn } from 'child_process');
const path from 'path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////



const installPythonLibraries = () => {
  return new Promise((resolve, reject) => {
    const libraries = ['pandas', 'transformers', 'pymongo'];
    const commands = libraries.map(library => `pip install ${library}`).join(' && ');

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

startProcessing();
