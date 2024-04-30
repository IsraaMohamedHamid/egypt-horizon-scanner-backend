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

const {
  startProcessing
} = require('../../python_functions');


///////////////// PACKAGES /////////////////

// const jwt = require("jsonwebtoken");

// const multer = require("multer");
// const path = require("path");

// const fs = require("fs");
const {
  spawn
} = require('child_process');
const path = require('path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


const emergingIssueDataUpdate = async () => {
  try {

    var dataToSend;

    startProcessing();

    console.log(`START: Processing emerging issues.`);
    // spawn new child process to call the python script
    const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

    // collect data from script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
      dataToSend = data.toString();
    });

    // in case of any error in the script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    // in close event we are sure that stream from child process is closed
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      // send data to browser
      // res.send(dataToSend)
    });
  } catch (error) {
    console.error('Error during processing:', error);
  }
};

// Count the number of positive data, neutral data, and negative data
const emergingIssueComponentsCalculation = async function () {
  try {

    console.log(`START: Sentiment analysis for emerging issues data.`);
    await emergingIssueDataUpdate().then(() => {
      console.log(`END: Sentiment analysis for emerging issues data.`);
    });

    
    }
  } catch (error) {
    console.error('Error during processing:', error);
  }
};


module.exports = {
  emergingIssueDataUpdate: emergingIssueDataUpdate,
  emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};