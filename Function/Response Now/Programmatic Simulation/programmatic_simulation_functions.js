////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

import {
  spawn
} from 'child_process';

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


/// Function to initiate Python script for processing data
// Function to initiate Python script for processing data
export const ProgrammaticSimulation = (projectDetails) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing emerging issues.`);
      const pythonProcess = spawn('python3', ['Function/Response Now/Programmatic Simulation/summarizing_programmatic_simulation_data.py', JSON.stringify(projectDetails)]);
      let pythonOutput = '';
      let pythonError = '';

      pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(pythonOutput));
        } else {
          reject(pythonError);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  ProgrammaticSimulation
};