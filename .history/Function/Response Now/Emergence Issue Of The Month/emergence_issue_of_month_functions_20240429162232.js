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
      // Fetch unique emergingIssues
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergenceIssue");
      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          // Fetch all documents for the current issue
          const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergenceIssue: issue });

          // Calculate average weight and count repetitions
          let totalWeight = 0;
          issueDocuments.forEach(doc => totalWeight += doc.weight);
          const averageWeight = issueDocuments.length > 0 ? totalWeight / issueDocuments.length : 0;
          const repetition = issueDocuments.length;

          // Determine remarks based on weight and repetition
          let remarks;
          if (averageWeight >= 80) {
              remarks = repetition > 2 ? 'High Priority' : repetition === 2 ? 'Medium Priority' : 'Low Priority';
          } else {
              remarks = repetition > 2 ? 'Medium Priority' : repetition === 2 ? 'Low Priority' : 'Other Issues';
          }

          console.log(`${issue} - Average Weight: ${averageWeight.toFixed(2)}, Repetition: ${repetition}, Remarks: ${remarks}`);

          // Continue with existing aggregation for sources and SDG targets
          const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
              { $match: { emergenceIssue: issue } },
              { $group: {
                  _id: "$emergenceIssue",
                  sources: { $addToSet: "$source" }, // Unique sources
                  sdgTargets: { $addToSet: "$sdgTargeted" } // Unique SDG targets
              }}
          ]);

          const { sources, sdgTargets } = aggregation.length > 0 ? aggregation[0] : { sources: [], sdgTargets: [] };

          // Continue with existing counts
          const totalDataCount = repetition;  // Use repetition as the total count
          const positiveSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "Positive").length;
          const neutralSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "Neutral").length;
          const negativeSentimentAnalysisDataCount = issueDocuments.filter(doc => doc.sentimentAnalysis === "Negative").length;

          console.log(`${issue} - Total: ${totalDataCount}, Positive: ${positiveSentimentAnalysisDataCount}, Neutral: ${neutralSentimentAnalysisDataCount}, Negative: ${negativeSentimentAnalysisDataCount}`);

          // Update the main model
          await EmergenceIssueOfTheMonthModel.findOneAndUpdate({
              emergingIssue: issue
          }, {
              $set: {
                  totalDataCount,
                  positiveSentimentAnalysisDataCount,
                  neutralSentimentAnalysisDataCount,
                  negativeSentimentAnalysisDataCount,
                  sources: sources, // Updated sources
                  sdgTargets: sdgTargets.flat(), // Flattened array of SDG targets
                  remarks
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