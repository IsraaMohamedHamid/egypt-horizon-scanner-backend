////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
const {
  EmergenceIssueOfTheMonthModel,
  EmergenceIssueOfTheMonthSchema
} = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model');

const {
  EmergenceIssueOfTheMonthDataModel,
  EmergenceIssueOfTheMonthDataSchema
} = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model');

const {
  startProcessing
} = require('../../python_functions');


///////////////// PACKAGES /////////////////

// const jwt = require("jsonwebtoken");

// const multer = require("multer");
// const path = require("path");

// const fs = require("fs");
const {
  spawn
} = require('child_process');
const path = require('path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


const emergingIssueDataUpdate = () => {
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

// Count the number of positive data, neutral data, and negative data
const emergingIssueComponentsCalculation = async function () {
  try {
      console.log(`START: Processing emerging issues.`);
      // Retrieve all unique 'emergingIssue' entries from the database
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          // Retrieve all documents related to the current issue
          const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: issue });

          // Calculate the total weight and determine the average weight
          let totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.weight, 0);
          const averageWeight = issueDocuments.length > 0 ? totalWeight / issueDocuments.length : NaN;
          const repetition = issueDocuments.length;

          // Determine priority based on average weight and repetition
          let priority;
          if (isNaN(averageWeight)) {
              priority = 'Other Issues';
          } else if (averageWeight >= 80) {
              priority = repetition > 2 ? 'High' : repetition === 2 ? 'Medium' : 'Low';
          } else {
              priority = repetition > 2 ? 'Medium' : repetition === 2 ? 'Low' : 'Other Issues';
          }

          console.log(`${issue} - Average Weight: ${isNaN(averageWeight) ? 'NaN' : averageWeight.toFixed(2)}, Repetition: ${repetition}, Priority: ${priority}`);

          // Aggregate data to get unique sources and SDG targets
          const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
              { $match: { emergingIssue: issue } },
              { $group: {
                  _id: "$emergingIssue",
                  sources: { $addToSet: "$source" },
                  sdgTargets: { $addToSet: "$sdgTargeted" }
              }}
          ]);
          const allSDGTargets = EmergenceIssueOfTheMonthDataModel.reduce((acc, item) => acc.concat(item.sdgTargeted), []);
          const uniqueSDGTargets = [...new Set(allSDGTargets)];

          let { sources, sdgTargets } = aggregation.length > 0 ? aggregation[0] : { sources: [], sdgTargets: [] };
          sdgTargets = [...new Set([].concat(...sdgTargets))]; // Flatten and deduplicate SDG targets

          // Count the sentiment analysis results
          const totalDataCount = repetition;
          const positiveSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "positive").length;
          const neutralSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "neutral").length;
          const negativeSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "negative").length;

          console.log(`${issue} - Total: ${totalDataCount}, Positive: ${positiveSentimentAnalysisDataCount}, Neutral: ${neutralSentimentAnalysisDataCount}, Negative: ${negativeSentimentAnalysisDataCount}`);

          // Update or create new document in the EmergenceIssueOfTheMonthModel
          const existingDocument = await EmergenceIssueOfTheMonthModel.findOne({ emergingIssue: issue });
          if (existingDocument) {
              await EmergenceIssueOfTheMonthModel.findOneAndUpdate({
                  emergingIssue: issue
              }, {
                  $set: {
                      totalDataCount,
                      positiveSentimentAnalysisDataCount,
                      neutralSentimentAnalysisDataCount,
                      negativeSentimentAnalysisDataCount,
                      sources,
                      uniqueSDGTargets,
                      averageWeight: isNaN(averageWeight) ? null : averageWeight,
                      priority
                  }
              });
          } else {
              const newDocument = new EmergenceIssueOfTheMonthModel({
                  emergingIssue: issue,
                  totalDataCount,
                  positiveSentimentAnalysisDataCount,
                  neutralSentimentAnalysisDataCount,
                  negativeSentimentAnalysisDataCount,
                  sources,
                  sdgTargets,
                  averageWeight: isNaN(averageWeight) ? null : averageWeight,
                  priority
              });
              await newDocument.save();
          }
      }
  } catch (error) {
      console.error('Error during processing:', error);
  }
};

module.exports = {
  emergingIssueDataUpdate: emergingIssueDataUpdate,
  emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};
