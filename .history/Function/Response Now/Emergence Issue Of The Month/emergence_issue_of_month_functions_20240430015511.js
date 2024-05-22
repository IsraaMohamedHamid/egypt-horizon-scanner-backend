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


  export default  {
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};