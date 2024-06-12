////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

import {
  DimensionsModel
} from '../../Model/Digital Avatar/dimension.js';
import {
  spawn
} from 'child_process';

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


// Function to initiate Python script for processing data
export const DimensionsDataUpdate = async () => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing emerging issues.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/']);

      // collect data from script
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
      });

      // in case of any error in the script
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
      });

      // in close event we are sure that stream from child process is closed
      pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};


export default {
  DimensionsDataUpdate
};