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
    console.log(`START: Processing emerging issues.`);
    // spawn new child process to call the python script
    const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

    // collect data from script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data.toString()}`);
    });

    // in case of any error in the script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data.toString()}`);
      reject(new Error(`Python script encountered an error: ${data.toString()}`));
    });

    // in close event we are sure that stream from child process is closed
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

      // console.log(`${issue} - Average Weight: ${Number.isNaN(averageWeight) ? 'NaN' : averageWeight.toFixed(2)}, Repetition: ${repetition}, Priority: ${priority}`);

      const updateData = await compileIssueData(issue, issueDocuments);

      // Add priority dictionary and update dictionary
      updateData["priority"] = priority;
      print
      
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
async function compileIssueData(issue, issueDocuments) {
  console.log(`Compiling data for issue ${issue}.`);
  
  const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
    { $match: { emergingIssue: issue } },
    { $group: {
        _id: "$emergingIssue",
        sources: { $addToSet: "$source" },
        sdgTargeted: { $addToSet: "$sdgTargeted" }
    }}
  ]);

  // Initialize the dictionary to count occurrences of each SDG target
  const sdgTargetedDictionary = {};
  
  // Global aggregation to count all SDG targets across all documents
  const sdgAggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
    { $match: { emergingIssue: issue } },
    { $unwind: "$sdgTargeted" },  // Unwind the array of SDG targets
    { $group: {
        _id: "$sdgTargeted",
        count: { $sum: 1 }  // Sum up all occurrences of each SDG target
    }}
  ]);

  // Fill the dictionary with the results from the aggregation
  sdgAggregation.forEach(item => {
    sdgTargetedDictionary[item._id] = item.count;
  });

  let { sources, sdgTargeted } = aggregation.length > 0 ? aggregation[0] : { sources: [], sdgTargeted: [] };

  sdgTargeted = [...new Set([].concat(...sdgTargeted))];
  sdgTargeted.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  console.log(`Data compiled for issue ${issue}.`);

  const totalDataCount = issueDocuments.length;
  const positiveSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "positive").length;
  const neutralSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "neutral").length;
  const negativeSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "negative").length;

  console.log(`${issue} - Total: ${totalDataCount}, Positive: ${positiveSentimentAnalysisDataCount}, Neutral: ${neutralSentimentAnalysisDataCount}, Negative: ${negativeSentimentAnalysisDataCount}`);

  return {
    sources,
    sdgTargeted,
    sdgTargetedDictionary,
    totalDataCount,
    positiveSentimentAnalysisDataCount,
    neutralSentimentAnalysisDataCount,
    negativeSentimentAnalysisDataCount
  };
}

// Function to update database with calculated data
async function updateEmergenceIssue(issue, data) {
  const {
    sources,
    sdgTargeted,
    sdgTargetedDictionary,
    totalDataCount,
    positiveSentimentAnalysisDataCount,
    neutralSentimentAnalysisDataCount,
    negativeSentimentAnalysisDataCount
  } = data;
  await EmergenceIssueOfTheMonthModel.updateOne({
    emergingIssue: issue
  }, {
    $set: {
      sources,
      sdgTargeted,
      sdgTargetedDictionary,
      totalDataCount,
      positiveSentimentAnalysisDataCount,
      neutralSentimentAnalysisDataCount,
      negativeSentimentAnalysisDataCount
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