
////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
  
///////////////// PACKAGES /////////////////

// const jwt from "jsonwebtoken");

// const multer from "multer");
// const path from "path");

// const fs from "fs");
const { spawn } from 'child_process');
const { exec } from 'child_process');
const path from 'path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

const pythonFunctions = () => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing emerging issues.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

      // collect data from script
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
      });

      // in case of any error in the script
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
        reject(new Error(`Python script encountered an error: ${data}`));
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


const installPythonLibraries = () => {
  return new Promise((resolve, reject) => {
    const libraries = ['pandas', 'transformers', 'pymongo', 'nltk', 'numpy', 'scipy', 'sklearn', 'matplotlib', 'seaborn', 'wordcloud', 'torch', 'torchvision', 'PIL', ''];
    const commands = libraries.map(library => `pip3 install ${library}`).join(' && ');

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
export default  {
    startProcessing: startProcessing
};
