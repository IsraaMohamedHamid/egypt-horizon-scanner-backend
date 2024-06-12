////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

import {
  spawn
} from 'child_process';

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


/// Function to initiate Python script for processing data
export const ProgrammaticSimulation = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing emerging issues.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/Response Now/Programmatic Simulation/summarizing_programmatic_simulation_data.py']);

      let pythonOutput = '';

      // collect data from script
      pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
        console.log(`Python stdout: ${data}`);
      });

      // in case of any error in the script
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
      });

      // on close event, we are sure that the stream from child process is closed
      pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
        resolve(pythonOutput); // Resolve with the output from the Python script
      });
    } catch (error) {
      reject(error);
    }
  });
};


export default {
  ProgrammaticSimulation
};