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

const uri = 'mongodb+srv://doadmin:w94yB2Y17dWE8C63@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let collection;

async function connectToMongoDB() {
  if (!collection) {
    try {
      await client.connect();
      const database = client.db('egypt-horizon-scanner');
      collection = database.collection('emergence_issue_of_the_month_data');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }
}

export const emergingIssueDataSummary = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing emerging issues.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/summarizing_emergence_issue_of_the_month_data.py']);

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

// Function to calculate various metrics and update MongoDB accordingly
export const emergingIssueComponentsCalculation = async () => {
  try {
    console.log(`START: Calculating components for emerging issues.`);
    const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
    console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

    // Prepare data from sources (all from the model)
    const combinedData = [];
    for (const issue of uniqueIssues) {
      const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: issue });
      combinedData.push(...issueDocuments);
    }

    console.log(`Combined data length: ${combinedData.length}`);

    // Extract unique IDs from combined data
    const uniqueIssueTitles = [...new Set(combinedData.map(issue => issue.issueTitle))];

    // Combine data from three sources and add 'Repeated' column
    const emergingIssues = uniqueIssueTitles.map(issueTitle => {
      const issueDocuments = combinedData.filter(doc => doc.Id === issueId);
      const description = issueDocuments[0].Description; // Assuming description is the same for same Id
      const totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.Weight, 0);
      const repetition = issueDocuments.length;
      return { Id: issueId, Description: description, TotalWeight: totalWeight, Repetition: repetition };
    });

    // Sort Emerging Issues by Weight and Repetition
    emergingIssues.sort((a, b) => {
      if (b.TotalWeight === a.TotalWeight) {
        return b.Repetition - a.Repetition;
      }
      return b.TotalWeight - a.TotalWeight;
    });

    // Determine priority and update MongoDB
    for (const issue of emergingIssues) {
      const priority = determinePriority(issue.TotalWeight, issue.Repetition);
      const issueDocuments = combinedData.filter(doc => doc.Id === issue.Id);
      const updateData = await compileIssueData(issue.Id, issueDocuments);
      updateData["priority"] = priority;
      await updateEmergenceIssue(issue.Id, updateData);
    }
  } catch (error) {
    console.error('Error during component calculation:', error);
  }
};

// Helper function to determine priority based on weight and repetition
function determinePriority(totalWeight, repetition) {
  if (totalWeight >= 80) return repetition > 2 ? 'High Priority' : repetition > 1 ? 'Medium Priority' : 'Low Priority';
  return repetition > 2 ? 'Medium Priority' : repetition > 1 ? 'Low Priority' : 'Other Issues';
}

// Function to compile data for an issue
async function compileIssueData(issueId, issueDocuments) {
  console.log(`Compiling data for issue ${issueId}.`);

  const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([{
      $match: {
        Id: issueId
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

  // Initialize the dictionary to count occurrences of each SDG target
  const sdgTargetedDictionary = {};

  // Global aggregation to count all SDG targets across all documents
  const sdgAggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([{
      $match: {
        Id: issueId
      }
    },
    {
      $unwind: "$sdgTargeted"
    },
    {
      $group: {
        _id: "$sdgTargeted",
        count: {
          $sum: 1
        }
      }
    }
  ]);

  // Fill the dictionary with the results from the aggregation
  sdgAggregation.forEach(item => {
    sdgTargetedDictionary[item._id] = item.count; // Ensure count is a number
  });

  let {
    sources,
    sdgTargeted
  } = aggregation.length > 0 ? aggregation[0] : {
    sources: [],
    sdgTargeted: []
  };

  sdgTargeted = [...new Set([].concat(...sdgTargeted))];
  sdgTargeted.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  console.log(`Data compiled for issue ${issueId}.`);

  const totalDataCount = issueDocuments.length;
  const positiveSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "positive").length;
  const neutralSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "neutral").length;
  const negativeSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "negative").length;

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
  await EmergenceIssueOfTheMonthDataModel.updateOne({
    emergingIssue: issue
  }, {
    $set: {
      sources,
      sdgTargeted,
      sdgTargetedDictionary,
      totalDataCount,
      positiveSentimentAnalysisDataCount,
      neutralSentimentAnalysisDataCount,
      negativeSentimentAnalysisDataCount,
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