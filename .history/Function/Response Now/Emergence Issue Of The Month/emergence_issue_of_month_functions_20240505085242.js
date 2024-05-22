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

const {
  startProcessing
} from '../../python_functions');


///////////////// PACKAGES /////////////////

// const jwt from "jsonwebtoken");

// const multer from "multer");
// const path from "path");

// const fs from "fs");
const {
  spawn
} from 'child_process');
const path from 'path');

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
const emergingIssueComponentsCalculation = async function emergingIssueComponentsCalculation() {
  try {
      // This could be an initial setup or preprocessing step, uncomment when ready
      // await startProcessing();

      console.log(`START: Processing emerging issues.`);
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");
      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: issue });

          let totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.weight, 0);
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

          console.log(`${issue} - Average Weight: ${isNaN(averageWeight) ? 'NaN' : averageWeight.toFixed(2)}, Repetition: ${repetition}, Priority: ${priority}`);

          const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
              { $match: { emergingIssue: issue } },
              { $group: {
                  _id: "$emergingIssue",
                  sources: { $addToSet: "$source" },
                  sdgTargets: { $addToSet: "$sdgTargeted" }
              }}
          ]);

          let { sources, sdgTargets } = aggregation.length > 0 ? aggregation[0] : { sources: [], sdgTargets: [] };
          sdgTargets = [...new Set([].concat(...sdgTargets))]; // Flatten and deduplicate SDG targets

          const totalDataCount = repetition;
          const positiveSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "positive").length;
          const neutralSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "neutral").length;
          const negativeSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "negative").length;

          console.log(`${issue} - Total: ${totalDataCount}, Positive: ${positiveSentimentAnalysisDataCount}, Neutral: ${neutralSentimentAnalysisDataCount}, Negative: ${negativeSentimentAnalysisDataCount}`);

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
                      sdgTargets,
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
}


export default  {
  emergingIssueDataUpdate: emergingIssueDataUpdate,
  emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};
