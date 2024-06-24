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

const uri = 'mongodb+srv://doadmin:6d30Bi4ec59u7ag1@egypt-horizon-scanner-1948d167.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=egypt-horizon-scanner';
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
  if (!data || data.length === 0) {
    throw new Error('Data is required');
  }

  await connectToMongoDB();

  return new Promise((resolve, reject) => {
    const process = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/summarizing_emergence_issue_of_the_month_data.py', JSON.stringify(data)]);

    let resultData = '';
    process.stdout.on('data', data => {
      resultData += data.toString();
    });

    process.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', code => {
      if (code !== 0) {
        reject(new Error('Failed to process data'));
      } else {
        try {
          const results = JSON.parse(resultData);
          results.forEach(async result => {
            await collection.updateOne({

              Link: result.link
            }, {
              $set: result
            }, {
              upsert: true
            });
          });
          resolve(results);
        } catch (error) {
          reject(new Error('Failed to parse Python script output'));
        }
      }
    });
  });
}

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

    for (const issue of uniqueIssues) {
      const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({
        emergingIssue: issue
      });
      const totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.weight, 0);
      const averageWeight = issueDocuments.length ? totalWeight / issueDocuments.length : NaN;
      const repetition = issueDocuments.length;
      const priority = determinePriority(averageWeight, repetition);

      const updateData = await compileIssueData(issue, issueDocuments);
      updateData["priority"] = priority;
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

  // Initialize the dictionary to count occurrences of each SDG target
  const sdgTargetedDictionary = {};

  // Global aggregation to count all SDG targets across all documents
  const sdgAggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([{
      $match: {
        emergingIssue: issue
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

  console.log(`Data compiled for issue ${issue}.`);

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