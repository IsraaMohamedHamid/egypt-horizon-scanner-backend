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
    EmergenceIssueOfTheMonthDataModel,
    EmergenceIssueOfTheMonthDataSchema
    
  

///////////////// PACKAGES /////////////////

// const jwt = require("jsonwebtoken");

// const multer = require("multer");
// const path = require("path");

// const fs = require("fs");
const { spawn } = require('child_process');
const path = require('path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////


const emergingIssueDataUpdate = async () => {
  try {
 
    var dataToSend;

    console.log(`START: Processing emerging issues.`);
    // spawn new child process to call the python script
    const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/update_emergence_issue_of_the_month_data.py']);

    // collect data from script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
      dataToSend = data.toString();
    });

    // in case of any error in the script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    // in close event we are sure that stream from child process is closed
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      // send data to browser
      // res.send(dataToSend)
    });
  } catch (error) {
    console.error('Error during processing:', error);
  }
};

// Count the number of positive data, neutral data, and negative data
const emergingIssueComponentsCalculation = async function () {
  try {
      console.log(`START: Sentiment analysis for emerging issues data.`);
      await emergingIssueDataUpdate();
      console.log(`START: Processing emerging issues.`);
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: issue });
          

          let totalWeight = 0;
          issueDocuments.forEach(doc => totalWeight += doc.weight);
          const averageWeight = issueDocuments.length > 0 ? totalWeight / issueDocuments.length : NaN;
          const repetition = issueDocuments.length;

          let priority;
          if (isNaN(averageWeight)) {
              priority = 'Other Issues';
          } else if (averageWeight >= 80) {
              priority = repetition > 2 ? 'High' : repetition === 2 ? 'Medium' : 'Low';
          } else {
              priority = repetition > 2 ? 'Medium' : repetition === 2 ? 'Low' : 'Other Issues';
          }

          console.log(`${issue} - Average Weight: ${isNaN(averageWeight) ? 'NaN' : averageWeight.toFixed(2)}, Repetition: ${repetition}, priority: ${priority}`);

          const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
              { $match: { emergingIssue: issue } },
              { $group: {
                  _id: "$emergingIssue",
                  sources: { $addToSet: "$source" },
                  sdgTargets: { $addToSet: "$sdgTargeted" }
              }}
          ]);

          const { sources, sdgTargets } = aggregation.length > 0 ? aggregation[0] : { sources: [], sdgTargets: [] };

          const totalDataCount = repetition;
          const positiveSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "Positive").length;
          const neutralSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "Neutral").length;
          const negativeSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "Negative").length;

          console.log(`${issue} - Total: ${totalDataCount}, Positive: ${positiveSentimentAnalysisDataCount}, Neutral: ${neutralSentimentAnalysisDataCount}, Negative: ${negativeSentimentAnalysisDataCount}`);

          // Check if the document exists
          const existingDocument = await EmergenceIssueOfTheMonthModel.findOne({ emergingIssue: issue });

          if (existingDocument) {
            // Document exists, update it
            await EmergenceIssueOfTheMonthModel.findOneAndUpdate(
              { emergingIssue: issue },
              {
                $set: {
                  totalDataCount,
                  positiveSentimentAnalysisDataCount,
                  neutralSentimentAnalysisDataCount,
                  negativeSentimentAnalysisDataCount,
                  sources,
                  sdgTargets: sdgTargets.flat(),
                  averageWeight: isNaN(averageWeight) ? null : averageWeight,
                  priority
                }
              }
            );
          } else {
            // Document doesn't exist, create a new one
            const newDocument = new EmergenceIssueOfTheMonthModel({
              emergingIssue: issue,
              totalDataCount,
              positiveSentimentAnalysisDataCount,
              neutralSentimentAnalysisDataCount,
              negativeSentimentAnalysisDataCount,
              sources,
              sdgTargets: sdgTargets.flat(),
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
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};