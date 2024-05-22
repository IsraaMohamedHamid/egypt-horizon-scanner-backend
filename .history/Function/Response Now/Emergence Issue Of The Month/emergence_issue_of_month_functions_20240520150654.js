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

////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////

// URI to your MongoDB, usually from environment variables or directly as a string
const uri = 'mongodb+srv://doadmin:w94yB2Y17dWE8C63@dbaas-db-5626135-310aba91.mongo.ondigitalocean.com/egypt-horizon-scanner?tls=true&authSource=admin&replicaSet=dbaas-db-5626135';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  authSource: 'admin',
});

export async function watchEmergingIssues2() {
  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("egypt-horizon-scanner");
    const collection = db.collection('emergence_issue_of_the_month_data');

    const changeStream = collection.watch();
    console.log('Watching for changes in Emerging Issues data...');

    changeStream.on('change', async (change) => {
      console.log('Change detected');
      await emergingIssueDataUpdate();
      await emergingIssueComponentsCalculation();
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

export async function watchEmergingIssues() {
  try {
    if (!client.isConnected()) {
      await client.connect();
      console.log("Connected successfully to server");
    }
    console.log("Connected already to server");

    const db = client.db("egypt-horizon-scanner");
    const collection = db.collection('emergence_issue_of_the_month_data');

    console.log('Setting up change stream...');
    const changeStream = collection.watch([], { fullDocument: 'updateLookup' });
    console.log('Watching for changes in Emerging Issues data...');

    changeStream.on('change', async (change) => {
      console.log('Change detected:', change);
      try {
        await emergingIssueDataUpdate();
        await emergingIssueComponentsCalculation();
      } catch (processError) {
        console.error('Error processing change:', processError);
      }
    });

    changeStream.on('error', (streamError) => {
      console.error('Error in change stream:', streamError);
      changeStream.close();
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    // Optionally implement reconnection logic here
  }
}

export const emergingIssueDataUpdate = () => new Promise((resolve, reject) => {
  const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
    reject(new Error(`Python script encountered an error: ${data}`));
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Python process exited successfully');
      resolve();
    } else {
      reject(new Error(`Python process exited with code ${code}`));
    }
  });
});

// Calculate various metrics and update MongoDB accordingly
export const emergingIssueComponentsCalculation = async () => {
  try {
    console.log(`START: Processing emerging issues for metrics.`);
    const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
    console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

    for (const issue of uniqueIssues) {
      const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({
        emergingIssue: issue
      });
      const totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.weight, 0);
      const averageWeight = issueDocuments.length ? totalWeight / issueDocuments.length : NaN;
      const priority = determinePriority(averageWeight, issueDocuments.length);

      console.log(`${issue} - Average Weight: ${Number.isNaN(averageWeight) ? 'NaN' : averageWeight.toFixed(2)}, Repetition: ${issueDocuments.length}, Priority: ${priority}`);

      const {
        sources,
        sdgTargeted
      } = await summarizeIssueData(issue);

      const updateData = {
        totalDataCount: issueDocuments.lenclgth,
        positiveSentimentAnalysisDataCount: issueDocuments.filter(doc => doc.sentimentAnalysis === "positive").length,
        neutralSentimentAnalysisDataCount: issueDocuments.filter(doc => doc.sentimentAnalysis === "neutral").length,
        negativeSentimentAnalysisDataCount: issueDocuments.filter(doc => doc.sentimentAnalysis === "negative").length,
        sources,
        sdgTargeted,
        averageWeight: Number.isNaN(averageWeight) ? null : averageWeight,
        priority
      };

      await EmergenceIssueOfTheMonthModel.findOneAndUpdate({
        emergingIssue: issue
      }, {
        $set: updateData
      }, {
        upsert: true
      });
    }
  } catch (error) {
    console.error('Error during processing:', error);
  }
};

// Determine priority based on weight and repetition
export const determinePriority = (averageWeight, count) => {
  if (Number.isNaN(averageWeight)) return 'Other Issues';
  if (averageWeight >= 80) return count > 2 ? 'High' : count === 2 ? 'Medium' : 'Low';
  return count > 2 ? 'Medium' : count === 2 ? 'Low' : 'Other Issues';
};

// Summarize data for an issue
export const summarizeIssueData = async (issue) => {
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
  return aggregation.length > 0 ? aggregation[0] : {
    sources: [],
    sdgTargeted: []
  };
};

////////////////////////////////////////////// SCHEDULING //////////////////////////////////////////////

// Schedule tasks to run every 6 hours or on database change
export const scheduleTasks = () => {
  // Run every 6 hours
  schedule.scheduleJob('0 */6 * * *', () => {
    console.log('Scheduled job started.');
    emergingIssueDataUpdate().then(emergingIssueComponentsCalculation).catch(console.error);
  });

  // Additional triggers based on database changes can be implemented here
};

////////////////////////////////////////////// EXPORTS //////////////////////////////////////////////

export default {
  watchEmergingIssues,
  emergingIssueDataUpdate,
  emergingIssueComponentsCalculation,
  scheduleTasks
};

// Initialize scheduling
scheduleTasks();