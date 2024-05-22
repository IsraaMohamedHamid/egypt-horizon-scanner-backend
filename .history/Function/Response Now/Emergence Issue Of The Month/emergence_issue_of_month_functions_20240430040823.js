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

const {
  startProcessing
} from '../../python_functions');


///////////////// PACKAGES /////////////////

// const jwt from "jsonwebtoken");

// const multer from "multer");
// const path from "path");

// const fs from "fs");
const {
  spawn
} from 'child_process');
const path from 'path');

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
    }
  } catch (error) {
    console.error('Error during processing:', error);
  }
};


export default  {
  emergingIssueDataUpdate: emergingIssueDataUpdate,
  emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};