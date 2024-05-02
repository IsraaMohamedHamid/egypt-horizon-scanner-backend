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
  
      if (!emergingIssues.length) {
        res.status(404).send('No emerging issues found.');
        return;
      }
  
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
}