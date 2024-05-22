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
const createEmergingIssues = async (data) => {
  // Perform grouping and calculations
  const positiveCounts = {};
  const neutralCounts = {};
  const negativeCounts = {};
  const sdgTargetedDict = {};
  const sourcesDict = {};

  data.forEach((row) => {
      const issue = row.emergingIssue;
      const sentiment = row.sentiment;

      // Count sentiment
      if (sentiment === 'positive') {
          positiveCounts[issue] = (positiveCounts[issue] || 0) + 1;
      } else if (sentiment === 'neutral') {
          neutralCounts[issue] = (neutralCounts[issue] || 0) + 1;
      } else if (sentiment === 'negative') {
          negativeCounts[issue] = (negativeCounts[issue] || 0) + 1;
      }

      // Append sdgTargeted to dictionary
      const sdgTargeted = row.sdgTargeted;
      if (sdgTargeted && sdgTargeted.length > 0) {
          if (sdgTargetedDict[issue]) {
              sdgTargetedDict[issue].push(...sdgTargeted);
          } else {
              sdgTargetedDict[issue] = [...sdgTargeted];
          }
      }

      // Append sources to dictionary
      const sources = row.source;
      if (sources && sources.length > 0) {
          if (sourcesDict[issue]) {
              sourcesDict[issue].push(...sources);
          } else {
              sourcesDict[issue] = [...sources];
          }
      }
  });

  // Convert sentiment counts to DataFrame
  const positiveDF = Object.entries(positiveCounts).map(([issue, count]) => ({ emergingIssue: issue, positiveSentimentAnalysisDataCount: count }));
  const neutralDF = Object.entries(neutralCounts).map(([issue, count]) => ({ emergingIssue: issue, neutralSentimentAnalysisDataCount: count }));
  const negativeDF = Object.entries(negativeCounts).map(([issue, count]) => ({ emergingIssue: issue, negativeSentimentAnalysisDataCount: count }));

  // Merge sentiment count DataFrames with the original grouped data
  let groupedData = data.reduce((acc, row) => {
      acc[row.emergingIssue] = acc[row.emergingIssue] || { weightSum: 0, count: 0 };
      acc[row.emergingIssue].weightSum += row.weight;
      acc[row.emergingIssue].count++;
      return acc;
  }, {});

  groupedData = Object.entries(groupedData).map(([issue, { weightSum, count }]) => ({
      emergingIssue: issue,
      averageWeight: count > 0 ? weightSum / count : 0,
      repetition: count
  }));

  // Merge with sentiment count DataFrames
  groupedData.forEach((row) => {
      const positiveRow = positiveDF.find((item) => item.emergingIssue === row.emergingIssue);
      const neutralRow = neutralDF.find((item) => item.emergingIssue === row.emergingIssue);
      const negativeRow = negativeDF.find((item) => item.emergingIssue === row.emergingIssue);

      Object.assign(row, positiveRow, neutralRow, negativeRow);
  });

  // Fill NaN values with 0
  groupedData.forEach((row) => {
      row.positiveSentimentAnalysisDataCount = row.positiveSentimentAnalysisDataCount || 0;
      row.neutralSentimentAnalysisDataCount = row.neutralSentimentAnalysisDataCount || 0;
      row.negativeSentimentAnalysisDataCount = row.negativeSentimentAnalysisDataCount || 0;
  });

  // Add 'priority' column based on average weight and repetition
  groupedData.forEach((row) => {
      const conditions = [
          row.averageWeight >= 80 && row.repetition > 2,
          row.averageWeight >= 80 && row.repetition > 1,
          row.averageWeight >= 80 && row.repetition === 1,
          row.averageWeight < 80 && row.repetition > 2,
          row.averageWeight < 80 && row.repetition > 1,
          row.averageWeight < 80 && row.repetition === 1
      ];
      const choices = ['High', 'Medium', 'Low', 'Medium', 'Low', 'Other Issues'];
      row.priority = choices[conditions.findIndex((condition) => condition === true)] || 'Other Issues';
  });

  // Append sdgTargeted and sources lists without duplicates
  groupedData.forEach((row) => {
      row.sdgTargeted = [...new Set(sdgTargetedDict[row.emergingIssue] || [])];
      row.sources = [...new Set(sourcesDict[row.emergingIssue] || [])];
  });

  // Sort by average weight and repetition in descending order
  groupedData.sort((a, b) => b.averageWeight - a.averageWeight || b.repetition - a.repetition);

  return groupedData;
};

const emergingIssueComponentsCalculation = async () => {
  try {
      console.log(`START: Processing emerging issues.`);
      await emergingIssueDataUpdate();
      // Fetch unique emergingIssues
      const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergenceIssue");
      console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

      for (const issue of uniqueIssues) {
          console.log(`Processing issue: ${issue}`);

          // Fetch all documents for the current issue
          const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergenceIssue: issue });

          // Call function to process data and update MongoDB
          const processedData = await createEmergingIssues(issueDocuments);

          // Update MongoDB with processed data
          await Promise.all(processedData.map(async (row) => {
              await EmergenceIssueOfTheMonthModel.updateOne(
                  { emergingIssue: row.emergingIssue },
                  { $set: row },
                  { upsert: true }
              );
          }));

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