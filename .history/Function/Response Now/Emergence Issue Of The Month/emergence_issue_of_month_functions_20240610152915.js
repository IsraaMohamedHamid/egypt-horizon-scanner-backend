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

////////////////////////////////////////////// FUNCTIONS //////////////////////////////////////////////

export const emergingIssueDataSummary = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`START: Processing emerging issues.`);
      // spawn new child process to call the python script
      const pythonProcess = spawn('python3', ['Function/Response Now/Emergence Issue Of The Month/summarizing_emergence_issue_of_the_month_data.py']);

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
    console.log('START: Calculating components for emerging issues.');
    const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct('emergingIssue');
    console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

    // Prepare data from sources (all from the model)
    let combinedData = [];
    for (const issue of uniqueIssues) {
      const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergingIssue: issue });
      combinedData.push(...issueDocuments);
    }

    console.log(`Combined data length: ${combinedData.length}`);

    // Extract unique titles from combined data
    const uniqueIssueTitles = [...new Set(combinedData.map(issue => issue.issueTitle))];

    // Combine data from three sources and add 'Repeated' column
    const emergingIssues = uniqueIssueTitles.map(issueTitle => {
      const issueDocuments = combinedData.filter(doc => doc.issueTitle === issueTitle);
      const description = issueDocuments[0].description; // Assuming description is the same for the same issueTitle
      const totalWeight = issueDocuments.reduce((acc, doc) => acc + doc.weight, 0);
      const repetition = issueDocuments.length;
      const pillars = [...new Set(issueDocuments.map(doc => doc.pillar))];
      const dimensions = [...new Set(issueDocuments.map(doc => doc.dimension))];
      const indicators = [...new Set(issueDocuments.flatMap(doc => doc.indicators))];

      return { issueTitle, description, totalWeight, repetition, pillars, dimensions, indicators };
    });

    // Sort Emerging Issues by totalWeight and repetition
    emergingIssues.sort((a, b) => {
      if (b.totalWeight === a.totalWeight) {
        return b.repetition - a.repetition;
      }
      return b.totalWeight - a.totalWeight;
    });

    // Determine priority and update MongoDB
    for (const issue of emergingIssues) {
      const priority = determinePriority(issue.totalWeight, issue.repetition);
      const issueDocuments = combinedData.filter(doc => doc.issueTitle === issue.issueTitle);
      const updateData = await compileIssueData(issue.issueTitle, issueDocuments);
      updateData.pillar = issue.pillars;
      updateData.dimension = issue.dimensions;
      updateData.indicators = issue.indicators; // Convert array to comma-separated string
      updateData.priority = priority;
      updateData.totalWeight = issue.totalWeight;
      updateData.repetition = issue.repetition;
      updateData.averageWeight = issue.repetition ? issue.totalWeight ? (issue.totalWeight / issue.repetition) : 0 : 0; // Prevent NaN

      await updateEmergenceIssue(issue.issueTitle, updateData);
    }
  } catch (error) {
    console.error('Error during component calculation:', error);
  }
};

// Helper functions (you need to define these based on your application's logic)
const determinePriority = (totalWeight, repetition) => {
  if (totalWeight >= 80 && repetition > 2) return 'High';
  if (totalWeight >= 80 && repetition > 1) return 'Medium';
  if (totalWeight >= 80 && repetition === 1) return 'Low';
  if (totalWeight < 80 && repetition > 2) return 'Medium';
  if (totalWeight < 80 && repetition > 1) return 'Low';
  return 'Other';
};

// Function to compile data for an issue
async function compileIssueData(issueTitle, issueDocuments) {
  console.log(`Compiling data for issue ${issueTitle}.`);

  const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
    { $match: { issueTitle } },
    {
      $group: {
        _id: "$emergingIssue",
        sources: { $addToSet: "$source" },
        sdgTargeted: { $addToSet: "$sdgTargeted" }
      }
    }
  ]);

  // Initialize the dictionary to count occurrences of each SDG target
  const sdgTargetedDictionary = {};

  // Global aggregation to count all SDG targets across all documents
  const sdgAggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
    { $match: { issueTitle } },
    { $unwind: "$sdgTargeted" },
    {
      $group: {
        _id: "$sdgTargeted",
        count: { $sum: 1 }
      }
    }
  ]);

  // Fill the dictionary with the results from the aggregation
  sdgAggregation.forEach(item => {
    sdgTargetedDictionary[item._id] = item.count; // Ensure count is a number
  });

  let { sources, sdgTargeted } = aggregation.length > 0 ? aggregation[0] : { sources: [], sdgTargeted: [] };

  sdgTargeted = [...new Set([].concat(...sdgTargeted))];
  sdgTargeted.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

  console.log(`Data compiled for issue ${issueTitle}.`);

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
    negativeSentimentAnalysisDataCount,
  };
}

// Function to update database with calculated data
async function updateEmergenceIssue(issueTitle, data) {
  const {
    sources,
    sdgTargeted,
    sdgTargetedDictionary,
    totalDataCount,
    positiveSentimentAnalysisDataCount,
    neutralSentimentAnalysisDataCount,
    negativeSentimentAnalysisDataCount,
    averageWeight,
    repetition,
    priority,
    totalWeight,
    pillars,
    dimensions,
    indicators
  } = data;
  await EmergenceIssueOfTheMonthModel.updateOne(
    { emergingIssue: issueTitle },
    {
      $set: {
        sources,
        sdgTargeted,
        sdgTargetedDictionary,
        totalDataCount,
        positiveSentimentAnalysisDataCount,
        neutralSentimentAnalysisDataCount,
        negativeSentimentAnalysisDataCount,
        averageWeight,
        repetition,
        priority,
        totalWeight,
        pillar,
        dimensions,
        indicators
      }
    },
    { upsert: true }
  );
  console.log(`Issue ${issueTitle} updated successfully.`);
}


export default {
  emergingIssueDataUpdate,
  emergingIssueComponentsCalculation
};