////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

import {
  spawn
} from 'child_process';

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


// Function to initiate Python script for processing data
export const ProgrammaticSimulationDataUpdate DimensionsDataUpdate = async () => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing Programmatic Simulation.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/Response Now/Programmatic Simulation/summarizing_programmatic_simulation_data.py']);

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