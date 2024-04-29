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
  

  

///////////////// PACKAGES /////////////////

// const jwt = require("jsonwebtoken");

// const multer = require("multer");
// const path = require("path");

// const fs = require("fs");

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

// Count the number of positive data, neutral data, and negative data
const emergingIssueComponentsCalculation = async function () {
  try {
    console.log(`START`);
      // Fetch unique emergingIssues
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergingIssue");

      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          // Count the total number of documents for this issue
          const totalDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
              emergingIssue: issue,
          });

          let positiveSentimentAnalysisDataCount = 0;
          let neutralSentimentAnalysisDataCount = 0;
          let negativeSentimentAnalysisDataCount = 0;

          if (totalDataCount > 0) {
              // Only perform these counts if there are associated documents
              positiveSentimentAnalysisDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
                  emergingIssue: issue,
                  sentimentAnalysis: "Positive"
              });

              neutralSentimentAnalysisDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
                  emergingIssue: issue,
                  sentimentAnalysis: "Neutral"
              });

              negativeSentimentAnalysisDataCount = await EmergenceIssueOfTheMonthDataModel.countDocuments({
                  emergingIssue: issue,
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


  module.exports = {
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};