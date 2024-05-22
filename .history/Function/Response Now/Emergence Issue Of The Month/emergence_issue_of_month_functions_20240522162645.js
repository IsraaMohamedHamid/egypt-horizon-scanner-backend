////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

import {
  EmergenceIssueOfTheMonthModel
} from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model.js';
import {
  EmergenceIssueOfTheMonthDataModel
} from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model.js';
import {
  spawn
} from 'child_process';
import schedule from 'node-schedule';
import {
  MongoClient
} from 'mongodb';
import mongoose from 'mongoose';

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

// Function to initiate Python script for processing data
export const emergingIssueDataUpdate = async () => {
  return new Promise((resolve, reject) => {
    try {

      console.log(`START: Processing emerging issues.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

      // collect data from script
      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
      });

      // // in case of any error in the script
      // pythonProcess.stderr.on('data', (data) => {
      //   console.error(`Python stderr: ${data}`);
      //   reject(new Error(`Python script encountered an error: ${data}`));
      // });

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
export const emergingIssueDataUpdate2 = async () => {
  return new Promise((resolve, reject) => {
    console.log(`START: Processing emerging issues.`);
    // spawn new child process to call the python script
    const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data.toString()}`);
      reject(new Error(`Python script encountered an error: ${data.toString()}`));
    });

    // In close event we are sure that stream from child process is closed
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Python process exited successfully`);
        resolve();
      } else {
        console.error(`Python process exited with code ${code}`);
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
};

// Function to calculate various metrics and update MongoDB accordingly
export const emergingIssueComponentsCalculation = async () => {
  try {
    console.log(`START: Calculating components for emerging issues.`);
    const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
    console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

    for (const issue of uniqueIssues) {
      const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({
        emergingIssue: issue
      });
      const totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.weight, 0);
      const averageWeight = issueDocuments.length ? totalWeight / issueDocuments.length : NaN;
      const repetition = issueDocuments.length;
      const priority = determinePriority(averageWeight, repetition);

      console.log(`${issue} - Average Weight: ${Number.isNaN(averageWeight) ? 'NaN' : averageWeight.toFixed(2)}, Repetition: ${repetition}, Priority: ${priority}`);

      const updateData = await compileIssueData(issue);
      await updateEmergenceIssue(issue, updateData);
    }
  } catch (error) {
    console.error('Error during component calculation:', error);
  }
};

// Helper function to determine priority based on weight and repetition
function determinePriority(averageWeight, repetition) {
  if (Number.isNaN(averageWeight)) return 'Other Issues';
  if (averageWeight >= 80) return repetition > 2 ? 'High' : repetition === 2 ? 'Medium' : 'Low';
  return repetition > 2 ? 'Medium' : repetition === 2 ? 'Low' : 'Other Issues';
}

// Function to compile data for an issue
async function compileIssueData(issue) {
  console.log(`Compiling data for issue ${issue}.`);
  const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([{
      $match: {
        emergingIssue: issue
      }
    },
    {
      $group: {
        _id: "$emergingIssue",
        sources: {
          $addToSet: "$source"
        },
        sdgTargeted: {
          $addToSet: "$sdgTargeted"
        }
      }
    }
  ]);
  console.log(`Data compiled for issue ${issue}.`);
  co
  return aggregation.length > 0 ? aggregation[0] : {
    sources: [],
    sdgTargeted: []
  };
}

// Function to update database with calculated data
async function updateEmergenceIssue(issue, data) {
  const {
    sources,
    sdgTargeted
  } = data;
  await EmergenceIssueOfTheMonthModel.updateOne({
    emergingIssue: issue
  }, {
    $set: {
      sources,
      sdgTargeted,
      ...data
    }
  }, {
    upsert: true
  });
  console.log(`Issue ${issue} updated successfully.`);
}

export default {
  emergingIssueDataUpdate,
  emergingIssueComponentsCalculation
};