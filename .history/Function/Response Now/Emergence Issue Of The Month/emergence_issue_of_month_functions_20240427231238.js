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

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

// Count the number of positive data, neutral data, and negative data
const emergingIssueComponentsCalculation = async function () {
  try {
    console.log(`START: Processing emerging issues.`);
      // Fetch unique emergenceIssues
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergenceIssue");

      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          // Count the total number of documents for this issue
          const totalDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
              emergenceIssue: issue,
          });

          let positiveSentimentAnalysisDataCount = 0;
          let neutralSentimentAnalysisDataCount = 0;
          let negativeSentimentAnalysisDataCount = 0;

          if (totalDataCount > 0) {
              // Only perform these counts if there are associated documents
              positiveSentimentAnalysisDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
                  emergenceIssue: issue,
                  sentimentAnalysis: "Positive"
              });

              neutralSentimentAnalysisDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
                  emergenceIssue: issue,
                  sentimentAnalysis: "Neutral"
              });

              negativeSentimentAnalysisDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
                  emergenceIssue: issue,
                  sentimentAnalysis: "Negative"
              });
          }

          console.log(`${issue} - Total: ${totalDataCount}, Positive: ${positiveSentimentAnalysisDataCount}, Neutral: ${neutralSentimentAnalysisDataCount}, Negative: ${negativeSentimentAnalysisDataCount}`);

          // Update the main model with the counted data, upserting if not present
          await EmergenceIssueOfTheMonthModel.findOneAndUpdate({
              emergingIssue: issue
          }, {
              $set: {
                  totalDataCount,
                  positiveSentimentAnalysisDataCount,
                  neutralSentimentAnalysisDataCount,
                  negativeSentimentAnalysisDataCount
              }
          }, {
              upsert: true // Create a new document if one doesn't exist
          });
      }
  } catch (error) {
      console.error('Error during processing:', error);
  }
};

// Example call (assuming you have the array of emerging issues ready)
// emergingIssueComponentsCalculation(emergingIssuesArray).catch(console.error);


  export default  {
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};