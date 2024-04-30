////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
const {
    EmergenceIssueOfTheMonthModel,
    EmergenceIssueOfTheMonthSchema
  } = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model');
  
  const {
    EmergenceIssueOfTheMonthDataModel,
    EmergenceIssueOfTheMonthDataSchema
  } = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model');
  

  

///////////////// PACKAGES /////////////////

// const jwt = require("jsonwebtoken");

// const multer = require("multer");
// const path = require("path");

// const fs = require("fs");
const { spawn } = require('child_process');
const path = require('path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

const emergingIssueDataUpdate = async () => {
  try {
    console.log(`START: Processing emerging issues.`);
    const pythonProcess = spawn('python', ['update_emergence_issue_of_the_month_data.py']);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  } catch (error) {
    console.error('Error during processing:', error);
  }
};

// Count the number of positive data, neutral data, and negative data


  module.exports = {
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};