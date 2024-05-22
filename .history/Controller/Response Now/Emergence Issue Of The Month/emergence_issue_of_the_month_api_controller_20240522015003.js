////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////

// Consolidate model imports into a single line per model
import { EmergenceIssueOfTheMonthSchema, EmergenceIssueOfTheMonthModel  } from '../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model.js';

// Functions
import { emergingIssueDataUpdate,
  emergingIssueComponentsCalculation } from '../../../Function/Response Now/Emergence Issue Of The Month/emergence_issue_of_month_functions.js';

////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////

// Common sort order
const commonSort = {////////////////////////////////////////////// IMPORTS //////////////////////////////////////////////


///////////////// MODELS /////////////////
const {
  EmergenceIssueOfTheMonthModel,
  EmergenceIssueOfTheMonthSchema
} = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_model');

const {
  EmergenceIssueOfTheMonthDataModel,
  EmergenceIssueOfTheMonthDataSchema
} = require('../../../Model/Response Now/Emergence Issue Of The Month/emergence_issue_of_the_month_data_model');


///////////////// FUNCTIONS /////////////////
const {
  emergingIssueDataUpdate,
  emergingIssueComponentsCalculation
} = require('../../../Function/Response Now/Emergence Issue Of The Month/emergence_issue_of_month_functions');


////////////////////////////////////////////// API CONTROLLER //////////////////////////////////////////////


// Get a list of emergingIssue from the DB
const getEmergingIssues = async (req, res, next) => {
  console.log(`START: Sentiment analysis for emerging issues data.`);
  try {
    // Define the sort order
    const sort = {
      repetition: -1,
      time: -1,
      emergingIssue: -1
    };

    await emergingIssueDataUpdate().then(async () => {
      console.log(`END: Sentiment analysis for emerging issues data.`);

      // Calculate components for the retrieved emerging issues
      await emergingIssueComponentsCalculation().catch(console.error);

      console.log(`START: Retrieving and processing emerging issues.`);
  
      // Get all emerging issues from the database and sort them
      const emergingIssues = await EmergenceIssueOfTheMonthModel.find({}).sort(sort);

      console.log(`END: Retrieving and processing emerging issues.`);
  
      if (!emergingIssues.length) {
        res.status(404).send('No emerging issues found.');
        return;
      }

      console.log(`START: Sending sorted and processed emerging issues as response.`);
  
      // Send sorted and processed emerging issues as response
      res.send(emergingIssues);
    });

  } catch (error) {
    console.error('Failed to retrieve and process emerging issues:', error);
    res.status(500).send('Error retrieving emerging issues');
  }
};


const getEmergingIssueByName = (async (req, res, next) => {
  // Define the sort order
  const sort = {
    repetition: -1,
    time: -1,
    emergingIssue: -1
  };

  // 1. Count the number of positive data, neutral data, and negative data
  EmergenceIssueOfTheMonthModel.find({}).then(
    // Calculate components for the retrieved emerging issues
    await emergingIssueComponentsCalculation().catch(console.error)
  )

  // Get data for one emergingIssue
  EmergenceIssueOfTheMonthModel.find({
    emergingIssue: req.params.emergingIssue
  }).sort(sort).then(function (emergingIssue) {
    res.send(emergingIssue);
  });
})


// Add new emergingIssue to the DB
const createEmergingIssue = (async (req, res, next) => {
  // Define the sort order
  const sort = {
    repetition: -1,
    time: -1,
    emergingIssue: -1
  };

  // 1. Count the number of positive data, neutral data, and negative data
  EmergenceIssueOfTheMonthModel.find({}).then(
    // Calculate components for the retrieved emerging issues
    await emergingIssueComponentsCalculation().catch(console.error)
  )


  EmergenceIssueOfTheMonthModel.create(req.body).then(function (emergingIssue) {
    res.send(emergingIssue);
  }).catch(next);

})

// Update a emergingIssue in the DB
const updateEmergingIssueByID = (async (req, res, next) => {
  // Define the sort order
  const sort = {
    repetition: -1,
    time: -1,
    emergingIssue: -1
  };

  // 1. Count the number of positive data, neutral data, and negative data
  EmergenceIssueOfTheMonthModel.find({}).then(
    // Calculate components for the retrieved emerging issues
    await emergingIssueComponentsCalculation().catch(console.error)
  )


  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findByIdAndUpdate({
    _id: req.params.id
  }, {
    $set: req.body
  }).then(function () {
    EmergenceIssueOfTheMonthModel.findOne({
      _id: req.params.id
    }).then(function (emergingIssue) {
      res.send(emergingIssue);
    });
  });
})

const updateEmergingIssueByEmergingIssueName = (async (req, res, next) => {
  // Define the sort order
  const sort = {
    repetition: -1,
    time: -1,
    emergingIssue: -1
  };

  // 1. Count the number of positive data, neutral data, and negative data
  EmergenceIssueOfTheMonthModel.find({}).then(
    // Calculate components for the retrieved emerging issues
    await emergingIssueComponentsCalculation().catch(console.error)
  )


  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findOneAndUpdate({
    emergingIssue: req.params.emergingIssue
  }, {
    $set: req.body
  }).then(function () {
    EmergenceIssueOfTheMonthModel.findOne({
      CemergingIssue: req.params.emergingIssue
    }).then(function (emergingIssue) {
      res.send(emergingIssue);
    });
  });
})


// Delete a emergingIssue from the DB
const deleteEmergingIssueByID = ((req, res, next) => {
  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findByIdAndRemove({
    _id: req.params.id
  }).then(function (emergingIssue) {
    res.send(emergingIssue);
  });
})

const deleteEmergingIssueByEmergingIssueName = ((req, res, next) => {
  //to access :id ---> req.params.id
  EmergenceIssueOfTheMonthModel.findOneAndRemove({
    emergingIssue: req.params.emergingIssue
  }).then(function (emergingIssue) {
    res.send(emergingIssue);
  });
})


module.exports = {
  getEmergingIssues: getEmergingIssues,
  getEmergingIssueByName: getEmergingIssueByName,
  createEmergingIssue: createEmergingIssue,
  updateEmergingIssueByID: updateEmergingIssueByID,
  updateEmergingIssueByEmergingIssueName: updateEmergingIssueByEmergingIssueName,
  deleteEmergingIssueByID: deleteEmergingIssueByID,
  deleteEmergingIssueByEmergingIssueName: deleteEmergingIssueByEmergingIssueName
}};

// Async handler to simplify try/catch blocks
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);



// Get a list of all emerging issues from the DB
export const getEmergingIssues = asyncHandler(async (req, res) => {
  console.log(`START: Retrieving and processing emerging issues.`);
  const emergingIssues = await EmergenceIssueOfTheMonthModel.find({}).sort(commonSort);
  console.log(`END: Retrieving and processing emerging issues.`);
  res.send(emergingIssues.length ? emergingIssues : 'No emerging issues found.');
});

// To start watching for changes
// watchEmergingIssues().catch(console.error);

// Get data for one emerging issue by name
export const getEmergingIssueByName = asyncHandler(async (req, res) => {
  await emergingIssueComponentsCalculation();
  const issue = await EmergenceIssueOfTheMonthModel.find({ emergingIssue: req.params.emergingIssue }).sort(commonSort);
  res.send(issue);
});

// Add a new emerging issue to the DB
export const createEmergingIssue = asyncHandler(async (req, res) => {
  const newIssue = await EmergenceIssueOfTheMonthModel.create(req.body);
  res.send(newIssue);
});

// Update an emerging issue in the DB by ID
export const updateEmergingIssueByID = asyncHandler(async (req, res) => {
  await findByIdAndUpdate(req.params.id, { $set: req.body });
  const updatedIssue = await EmergenceIssueOfTheMonthModel.findById(req.params.id);
  res.send(updatedIssue);
});

// Update an emerging issue by name
export const updateEmergingIssueByEmergingIssueName = asyncHandler(async (req, res) => {
  await findOneAndUpdate({ emergingIssue: req.params.emergingIssue }, { $set: req.body });
  const updatedIssue = await EmergenceIssueOfTheMonthModel.findOne({ emergingIssue: req.params.emergingIssue });
  res.send(updatedIssue);
});

// Delete an emerging issue from the DB by ID
export const deleteEmergingIssueByID = asyncHandler(async (req, res) => {
  const deletedIssue = await EmergenceIssueOfTheMonthModel.findByIdAndRemove(req.params.id);
  res.send(deletedIssue);
});

// Delete an emerging issue by name
export const deleteEmergingIssueByEmergingIssueName = asyncHandler(async (req, res) => {
  const deletedIssue = await EmergenceIssueOfTheMonthModel.findOneAndRemove({ emergingIssue: req.params.emergingIssue });
  res.send(deletedIssue);
});

export default {
  getEmergingIssues,
  getEmergingIssueByName,
  createEmergingIssue,
  updateEmergingIssueByID,
  updateEmergingIssueByEmergingIssueName,
  deleteEmergingIssueByID,
  deleteEmergingIssueByEmergingIssueName
};