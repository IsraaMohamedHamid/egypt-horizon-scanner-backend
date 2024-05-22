////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
const {
    EmergenceIssueOfTheMonthModel,
    EmergenceIssueOfTheMonthSchema
  } from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model.js');
  
  const {
    EmergenceIssueOfTheMonthDataModel,
    EmergenceIssueOfTheMonthDataSchema
  } from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model.js');
  

  

///////////////// PACKAGES /////////////////

// const jwt from "jsonwebtoken");

// const multer from "multer");
// const path from "path");

// const fs from "fs");
const { spawn } from 'child_process');
const path from 'path');

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

const emergingIssueDataUpdate = async () => {
  try {
    console.log(`START: Processing emerging issues.`);
    const pythonProcess = spawn('python', ['update_emergence_issue_of_the_month_data.py']);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
    });
  } catch (error) {
    console.error('Error during processing:', error);
  }
};

// Count the number of positive data, neutral data, and negative data
const emergingIssueComponentsCalculation = async function () {
  try {
      console.log(`START: Processing emerging issues.`);
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: issue });

          let totalWeight = 0;
          issueDocuments.forEach(doc => totalWeight += doc.weight);
          const averageWeight = issueDocuments.length > 0 ? totalWeight / issueDocuments.length : 0;
          const repetition = issueDocuments.length;

          let priority;
          if (averageWeight >= 80) {
              priority = repetition > 2 ? 'High' : repetition === 2 ? 'Medium' : 'Low';
          } else {
              priority = repetition > 2 ? 'Medium' : repetition === 2 ? 'Low' : 'Other Issues';
          }

          console.log(`${issue} - Average Weight: ${averageWeight.toFixed(2)}, Repetition: ${repetition}, priority: ${priority}`);

          if (!isNaN(averageWeight)) { // Check if averageWeight is a valid number
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
                    averageWeight,
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
                averageWeight,
                priority
              });
              await newDocument.save();
            }
          } else {
            console.log(`Skipping issue ${issue} because averageWeight is not a valid number.`);
          }
      }
  } catch (error) {
      console.error('Error during processing:', error);
  }
};

  export default  {
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};