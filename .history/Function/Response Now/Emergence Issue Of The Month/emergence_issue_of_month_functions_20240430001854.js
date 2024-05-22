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


const { spawn } from 'child_process');
const path from 'path');

const emergingIssueComponentsCalculation = async () => {
  try {
    console.log(`START: Processing emerging issues.`);
    const pythonProcess = spawn('python', ['update_issues_data.py']);

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
const emergingIssueComponentsCalculation = async () => {
  try {
    console.log(`START: Processing emerging issues.`);
    const uniqueIssues = await EmergenceIssueOfTheMonthDataModel.distinct("emergenceIssue");
    console.log(`Processing ${uniqueIssues.length} unique emerging issues.`);

    for (const issue of uniqueIssues) {
      console.log(`Processing issue: ${issue}`);

      const issueDocuments = await EmergenceIssueOfTheMonthDataModel.find({ emergenceIssue: issue });

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

      console.log(`${issue} - Average Weight: ${averageWeight.toFixed(2)}, Repetition: ${repetition}, Priority: ${priority}`);

      const aggregation = await EmergenceIssueOfTheMonthDataModel.aggregate([
        { $match: { emergenceIssue: issue } },
        { $group: {
            _id: "$emergenceIssue",
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

      await EmergenceIssueOfTheMonthModel.findOneAndUpdate({
        emergingIssue: issue
      }, {
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
      }, {
        upsert: true
      });
    }
  } catch (error) {
    console.error('Error during processing:', error);
  }
};
  
// Create emerging issues
const createEmergingIssues = async (data) => {
  const positiveCounts = {};
  const neutralCounts = {};
  const negativeCounts = {};
  const sdgTargetedDict = {};
  const sourcesDict = {};

  data.forEach(row => {
    const issue = row.emergingIssue;
    const sentiment = row.sentiment;

    if (sentiment === 'positive') {
      positiveCounts[issue] = (positiveCounts[issue] || 0) + 1;
    } else if (sentiment === 'neutral') {
      neutralCounts[issue] = (neutralCounts[issue] || 0) + 1;
    } else if (sentiment === 'negative') {
      negativeCounts[issue] = (negativeCounts[issue] || 0) + 1;
    }

    const sdgTargeted = row.sdgTargeted;
    if (sdgTargetedDict[issue]) {
      sdgTargetedDict[issue].push(...sdgTargeted);
    } else {
      sdgTargetedDict[issue] = [...sdgTargeted];
    }

    const sources = Array.isArray(row.source) ? row.source : [row.source];
    if (sourcesDict[issue]) {
      sourcesDict[issue].push(...sources);
    } else {
      sourcesDict[issue] = [...sources];
    }
  });

  const positiveData = Object.entries(positiveCounts).map(([issue, count]) => ({ emergingIssue: issue, positiveSentimentAnalysisDataCount: count }));
  const neutralData = Object.entries(neutralCounts).map(([issue, count]) => ({ emergingIssue: issue, neutralSentimentAnalysisDataCount: count }));
  const negativeData = Object.entries(negativeCounts).map(([issue, count]) => ({ emergingIssue: issue, negativeSentimentAnalysisDataCount: count }));

  const groupedData = data.reduce((acc, row) => {
    const issue = row.emergingIssue;
    if (!acc[issue]) {
      acc[issue] = { weight: 0, repetition: 0 };
    }
    acc[issue].weight += row.weight;
    acc[issue].repetition++;

    return acc;
  }, {});

  const priorityChoices = {
    'High': (averageWeight, repetition) => averageWeight >= 80 && repetition > 2,
    'Medium': (averageWeight, repetition) => averageWeight >= 80 && repetition > 1,
    'Low': (averageWeight, repetition) => averageWeight >= 80 && repetition === 1,
    'Medium': (averageWeight, repetition) => averageWeight < 80 && repetition > 2,
    'Low': (averageWeight, repetition) => averageWeight < 80 && repetition > 1,
    'Other Issues': () => true
  };

  const sortedData = Object.entries(groupedData).map(([issue, { weight, repetition }]) => {
    const priority = Object.keys(priorityChoices).find(choice => priorityChoices[choice](weight / repetition, repetition));
    const sdgTargeted = Array.from(new Set(sdgTargetedDict[issue] || []));
    const sources = Array.from(new Set(sourcesDict[issue] || []));

    return {
      emergingIssue: issue,
      averageWeight: weight / repetition,
      repetition,
      priority,
      sdgTargeted,
      sources
    };
  }).sort((a, b) => b.averageWeight - a.averageWeight || b.repetition - a.repetition);

  return sortedData;
};

// Example call (assuming you have the array of emerging issues ready)
// emergingIssueComponentsCalculation(emergingIssuesArray).catch(console.error);


  export default  {
    emergingIssueComponentsCalculation: emergingIssueComponentsCalculation
};